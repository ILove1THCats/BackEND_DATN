import { Request, Response, NextFunction } from "express";
/**
 * Lấy tất cả địa điểm
 */
export declare const getAllPlaces: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getSpecificPlace: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getAmenityTypes: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getNearbyPlaces: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Lấy địa điểm theo ID (kèm rating trung bình)
 */
export declare const getPlaceById: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Tạo địa điểm mới
 */
export declare const createPlace: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Cập nhật địa điểm
 */
export declare const updatePlace: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Xoá địa điểm
 */
export declare const deletePlace: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Lấy trung bình rating riêng (nếu không muốn dùng chung với getPlaceById)
 */
export declare const getAverageRatingByPlace: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=PlaceController.d.ts.map