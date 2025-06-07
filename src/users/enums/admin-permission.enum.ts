export enum AdminPermission {
  // Video Management
  UPLOAD_VIDEO = 'upload_video',
  EDIT_VIDEO = 'edit_video',
  DELETE_VIDEO = 'delete_video',

  // Category Management
  CREATE_CATEGORY = 'create_category',
  EDIT_CATEGORY = 'edit_category',
  DELETE_CATEGORY = 'delete_category',

  // User Management
  VIEW_USERS = 'view_users',
  EDIT_USERS = 'edit_users',
  DELETE_USERS = 'delete_users',

  // Analytics & Reports
  VIEW_ANALYTICS = 'view_analytics',

  // System Settings
  MANAGE_SETTINGS = 'manage_settings',
}
