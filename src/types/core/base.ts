export type Base = {
  id: UUID;
  createdAt?: string | Date;
  createdBy?: string;
  updatedAt?: string | Date | null;
  updatedBy?: string;
  isDeleted?: boolean;
  deletedAt?: string | Date | null;
  deletedBy?: string | null;
};

export type UUID = string;
