import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IsNotEmpty, IsPositive } from 'class-validator';
import { MedicalRecord } from './medical-record.entity';

export enum AttachmentType {
  IMAGE = 'IMAGE',
  PDF = 'PDF',
  DOC = 'DOC',
  VIDEO = 'VIDEO',
  OTHER = 'OTHER',
}

@Entity('attachments')
export class Attachment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'medical_record_id' })
  medicalRecordId: number;

  @Column({ name: 'file_name' })
  @IsNotEmpty()
  fileName: string;

  @Column({ name: 'file_url' })
  @IsNotEmpty()
  fileUrl: string;

  @Column({
    name: 'file_type',
    type: 'enum',
    enum: AttachmentType,
  })
  fileType: AttachmentType;

  @Column({ name: 'file_size' })
  @IsPositive()
  fileSize: number; // En bytes

  @Column({ name: 'mime_type', nullable: true })
  mimeType?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => MedicalRecord, (record) => record.attachments)
  @JoinColumn({ name: 'medical_record_id' })
  medicalRecord: MedicalRecord;

  // Métodos helper
  get fileSizeFormatted(): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (this.fileSize === 0) return '0 Bytes';
    const i = Math.floor(Math.log(this.fileSize) / Math.log(1024));
    return Math.round(this.fileSize / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }
} 