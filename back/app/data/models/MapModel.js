import mongoose from 'mongoose';


export const MapModelSchema = new mongoose.Schema({
    map: [[]],
    pngImg: String
});

export const MapModelModel = mongoose.model(
    'MapModel',
    MapModelSchema
)
