export interface Message {
  content: { type: string; sender: string; createdAt: string; msg: string };
  roomid: string;
}
