export default interface NotificationPayload {
  id_user: string;
  id_receiver: string;
  id_post?: string;
  username: string;
  actionType: 'like' | 'comment' | 'follow';
}
