import { ConfigService } from '@nestjs/config';
import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ForbiddenException, Logger } from '@nestjs/common';

import { AllConfigType } from '../../config/config.type';
import { JwtPayloadType } from '../../auth/strategies/types/jwt-payload';
import { RoleEnum } from '../../roles/roles.enum';
import { StudyGroupRedisService } from '../../study-timer/study-group-redis';

@WebSocketGateway({ namespace: 'admin/study-group' })
export class StudyGroupAdminGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(StudyGroupAdminGateway.name);

  constructor(
    private configService: ConfigService<AllConfigType>,
    private readonly jwtService: JwtService,
    private readonly studyGroupRedisService: StudyGroupRedisService,
  ) {}

  async handleDisconnect(client: Socket) {
    const memberId = client.data.memberId;
    if (!memberId) {
      this.logger.warn(`Member: ${memberId} not found.`);
      return;
    }
  }

  @SubscribeMessage('adminLogin')
  async handleAdminLogin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { jwtToken: string },
  ) {
    try {
      console.log(data.jwtToken);
      const decoded = this.jwtService.verify<JwtPayloadType>(data.jwtToken, {
        secret: this.configService.get('auth.secret', { infer: true }),
      });
      if (decoded.role?.role_id !== RoleEnum.admin) {
        client.emit('logginError', 'Access Denied');
        client.disconnect(); // 연결 거부
        return;
      }

      const initalState = await this.loadInitalState();

      this.logger.log('All study group data removed.');
      client.emit('initalState', initalState);
    } catch (e) {
      this.handleError(client, e);
    }
  }

  @SubscribeMessage('removeAllData')
  async handleRemoveAllGroup(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { jwtToken: string },
  ) {
    try {
      const decoded = this.jwtService.verify<JwtPayloadType>(data.jwtToken, {
        secret: this.configService.get('auth.secret', { infer: true }),
      });
      if (decoded.role?.role_id !== RoleEnum.admin) {
        throw new ForbiddenException();
      }

      await this.studyGroupRedisService.removeAllGroupsData();
      this.logger.log('All study group data removed.');
    } catch (e) {
      this.handleError(client, e);
    }
  }

  private async loadInitalState() {
    const groups = await this.studyGroupRedisService.getAllGroups(); // 모든 그룹 리스트 (groupId - count)

    return {
      groups,
    };
  }

  // 에러 핸들링
  private handleError(client: Socket, error: Error) {
    this.logger.error(error.message);
    client.emit('error', { message: error.message });
    client.disconnect();
  }
}
