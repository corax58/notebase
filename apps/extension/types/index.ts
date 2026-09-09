export interface CreateNote {
  content: string;
  folderId?: string;
  sourceUrl?: string;
  sourceTitle?: string;
  faviconUrl?: string;
  label?: string;
  tagIds?: string[];
}

export interface Note {
  tags: {
    id: string;
    name: string;
    createdAt: Date;
    userId: string;
  }[];
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  folderId: string | null;
  content: string;
  sourceUrl: string | null;
  sourceTitle: string | null;
  faviconUrl: string | null;
  label: string | null;
  archived: boolean;
  folder: {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    color: string | null;
  } | null;
}
