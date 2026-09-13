export interface InspectionRecord {
  id: string;
  equipmentId: string;
  assetNumber: string;
  equipmentName: string;
  modelName: string;
  department: string;
  location: string;
  registeredQuantity: number;
  actualQuantity: number;
  difference: number;
  status: 'matched' | 'mismatched';
  notes?: string;
  inspectorId: string;
  inspectorName: string;
  schoolId: string;
  schoolName: string;
  createdAt: string;
}
