export const STATUS_MESSAGES = {
  ERROR: {
    INTERNAL_SERVER_ERROR: '문제가 발생했습니다. 나중에 다시 시도해주세요.',
    OPERATION_FAILED: '작업에 실패했습니다. 다시 시도해주세요.',
  },
  AUTH: {
    UNAUTHORIZED: '접근이 거부되었습니다. 로그인 해주세요.',
    FORBIDDEN: '이 작업을 수행할 권한이 없습니다.',
  },
  ACCOUNT: {
    ACCOUNT_NOT_FOUND: '계정을 찾을 수 없습니다.',
    EMAIL_ALREADY_EXISTS: '이 이메일로 등록된 계정이 이미 존재합니다.',
  },
  VALIDATION: {
    NO_CONTENT: '변경할 내용이 없습니다.',
  },
  MEMBER: {
    MEMBER_NOT_FOUND: '사용자를 찾을 수 없습니다.',
  },
  RESOURCE: {
    RESOURCE_NOT_FOUND: (resource: string) => `${resource}를 찾을 수 없습니다.`,
    RESOURCE_ALREADY_EXISTS: (resource: string) =>
      `${resource}이(가) 이미 존재합니다.`,
  },
};
