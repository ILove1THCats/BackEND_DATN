export interface Place {
    id: number;
    geom: string;
    fid: number;
    full_id: string;
    osm_id: string;
    osm_type: string;
    amenity: string;
    opening_hours: string;
    brand_wikidata: string;
    brand: string;
    operator: string;
    name: string;
    path: string;
}
/**
 * Lấy toàn bộ địa điểm du lịch
 * @returns Promise<Place[]> - Danh sách tất cả địa điểm
 */
export declare const getAllPlaces: () => Promise<Place[]>;
/**
 * Lấy theo thứ đang tìm cafe, hotel, v.v....
 * @param amenity - địa điểm cần
 * @return
 */
export declare const getSpecificPlace: (amenity: string) => Promise<Place[]>;
export declare const amenityType: () => Promise<Place[]>;
export declare const nearbyPlace: (lat: number, lon: number, amenity: string, radius: number) => Promise<Place[]>;
/**
 * Lấy địa điểm theo ID
 * @param id - ID địa điểm
 * @returns Promise<Place | null>
 */
export declare const getPlaceById: (id: number) => Promise<Place | null>;
/**
 * Tạo địa điểm mới
 */
export declare const createPlace: (name: string, description: string, address: string, type_id: number, region_id: number, created_by: number, geom: string) => Promise<Place>;
/**
 * Cập nhật địa điểm
 */
export declare const updatePlace: (id: number, name?: string, description?: string, address?: string, type_id?: number, region_id?: number, geom?: string) => Promise<Place | null>;
/**
 * Xoá địa điểm
 */
export declare const deletePlace: (id: number) => Promise<Place | null>;
/**
 * Lấy địa điểm kèm trung bình rating
 */
export declare const getPlaceWithAverageRating: (placeId: number) => Promise<(Place & {
    avg_rating: number;
    total_reviews: number;
}) | null>;
//# sourceMappingURL=placeModel.d.ts.map