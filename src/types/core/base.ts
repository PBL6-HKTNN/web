export type Base = {
  id: string;
  createdAt?: string | Date;
  createdBy?: string;
  updatedAt?: string | Date | null;
  updatedBy?: string;
  isDeleted?: boolean;
  deletedAt?: string | Date | null;
  deletedBy?: string | null;
};
