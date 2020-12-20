import mongoose from 'mongoose';


export const MapModelSchema = new mongoose.Schema({
    pngImg: String,
    map: [[]]
});

export const MapModelModel = mongoose.model(
    'MapModel',
    MapModelSchema
)
