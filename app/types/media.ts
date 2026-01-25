// Media types and interfaces
export interface MediaParams {
  title: string;
  type: string;
  desc: string;
  image: string;
  video?: string;
  videoEmbed?: string; // Facebook embed code for videos
}

export interface ImageUploadResponse {
  message: string;
  success: boolean;
  image?: string;
  data?: any;
  [key: string]: any;
}

export interface MediaResponse {
  message: string;
  success: boolean;
  data?: any;
  [key: string]: any;
}

export interface Media extends MediaParams {
  id?: string;
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
  created_date?: string;
}
