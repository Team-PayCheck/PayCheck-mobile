// ============ 알림 설정 관련 타입 ============

/** [GET/PUT] /api/settings/me 응답 데이터 */
export interface NotificationSettings {
  id: number;
  userId: number;
  notificationEnabled: boolean;
  pushEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  scheduleChangeAlertEnabled: boolean;
  paymentAlertEnabled: boolean;
  correctionRequestAlertEnabled: boolean;
  invitationAlertEnabled: boolean;
  resignationAlertEnabled: boolean;
}

/** [PUT] /api/settings/me 요청 데이터 */
export interface NotificationSettingsUpdateRequest {
  notificationEnabled?: boolean;
  pushEnabled?: boolean;
  emailEnabled?: boolean;
  smsEnabled?: boolean;
  scheduleChangeAlertEnabled?: boolean;
  paymentAlertEnabled?: boolean;
  correctionRequestAlertEnabled?: boolean;
  invitationAlertEnabled?: boolean;
  resignationAlertEnabled?: boolean;
}
