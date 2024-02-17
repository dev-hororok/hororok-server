// 엔티티의 모든 속성에 배열과 undefined를 추가시켜줌
// ex) name: string  ->   name: string | string[] | undefined

export type EntityCondition<T> = {
  [P in keyof T]?: T[P] | T[P][] | undefined;
};
