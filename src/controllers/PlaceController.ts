import { Request, Response, NextFunction } from "express";
import * as placeModel from "../models/placeModel.js";
import { error } from "console";

///////////////////////////////////////
// CONTROLLER cho bảng tourist_places
///////////////////////////////////////

/**
 * Lấy tất cả địa điểm
 */
export const getAllPlaces = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const places = await placeModel.getAllPlaces();
    res.json(places);
  } catch (error) {
    next(error);
  }
};

export const getSpecificPlace = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const amenity = String(req.params.amenity)
    const places = await placeModel.getSpecificPlace(amenity);
    

    res.json(places);
  } catch (error) {
    next (error);
  }
}

export const getAmenityTypes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const amenityType = await placeModel.amenityType();

    res.json(amenityType);
  } catch (error) {
    next (error);
  }
}

export const getNearbyPlaces = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lat = Number(req.query.lat);
    const lon = Number(req.query.lon);
    const amenity = String(req.query.amenity);
    const radius = Number(req.query.radius) || 2000;

    const nearbyPlace = await placeModel.nearbyPlace( lon, lat, amenity, radius);

    res.json(nearbyPlace);
  } catch (error) {
    next (error);
  }
}

/**
 * Lấy địa điểm theo ID (kèm rating trung bình)
 */
export const getPlaceById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    
    if (isNaN(id)){
        return res.status(400).json({ message: "ID không hợp lệ" });
    }
    
    const place = await placeModel.getPlaceWithAverageRating(id);
    if (!place) return res.status(404).json({ message: "Place not found" });
    res.json(place);
  } catch (error) {
    next(error);
  }
};

/**
 * Tạo địa điểm mới
 */
export const createPlace = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, address, type_id, region_id, created_by, geom } = req.body;
    if (!name || !geom) {
      return res.status(400).json({ message: "Name and geom are required" });
    }
    const newPlace = await placeModel.createPlace(
      name,
      description,
      address,
      type_id,
      region_id,
      created_by,
      geom
    );
    res.status(201).json(newPlace);
  } catch (error) {
    next(error);
  }
};

/**
 * Cập nhật địa điểm
 */
export const updatePlace = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    
    if (isNaN(id)){
        return res.status(400).json({ message: "ID không hợp lệ" });
    }
    const { name, description, address, type_id, region_id, geom } = req.body;
    const updated = await placeModel.updatePlace(
      id,
      name,
      description,
      address,
      type_id,
      region_id,
      geom
    );
    if (!updated) return res.status(404).json({ message: "Place not found" });
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

/**
 * Xoá địa điểm
 */
export const deletePlace = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    
    if (isNaN(id)){
        return res.status(400).json({ message: "ID không hợp lệ" });
    }
    const deleted = await placeModel.deletePlace(id);
    if (!deleted) return res.status(404).json({ message: "Place not found" });
    res.json({ message: "Place deleted successfully", deleted });
  } catch (error) {
    next(error);
  }
};

/**
 * Lấy trung bình rating riêng (nếu không muốn dùng chung với getPlaceById)
 */
export const getAverageRatingByPlace = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const placeId = Number(req.params.id);
    
    if (isNaN(placeId)){
        return res.status(400).json({ message: "ID không hợp lệ" });
    }
    const data = await placeModel.getPlaceWithAverageRating(placeId);
    if (!data) return res.status(404).json({ message: "Place not found" });
    res.json({
      place_id: data.id,
      avg_rating: data.avg_rating,
      total_reviews: data.total_reviews,
    });
  } catch (error) {
    next(error);
  }
};
