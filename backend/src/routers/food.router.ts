
import { Router } from 'express';
import { sample_foods, sample_tags } from '../data';
import asyncHandler from 'express-async-handler';
import { FoodModel } from '../models/food.model';
import { updateTypeAliasDeclaration } from 'typescript';

const router = Router();


router.get("/seed", asyncHandler(
    async (re, res) => { 
        const foodsCount = await FoodModel.countDocuments();
        if(foodsCount > 0){
            res.send("Seed is already done");
            return;
        }

        await FoodModel.create(sample_foods);
        res.send("Seed is done");
}))

//This only works when it is async. However, async is inconsistent, which is why we use asynchandler
//API to get all foods
router.get("/", asyncHandler (
    async (req, res) => {
    const foods = await FoodModel.find();
    res.send(foods);
}))

//API to get food by searchTerm
router.get("/search/:searchTerm", asyncHandler (
    async (req, res) => {
    const searchRegex = new RegExp(req.params.searchTerm, 'i')
    const foods = await FoodModel.find({name: {$regex:searchRegex}});
    res.send(foods);
}))

//API to get the tag from all foods and group it
router.get("/tags", asyncHandler (
    async (req, res) => {
        const tags = await FoodModel.aggregate([
            {
                $unwind: '$tags'
            },
            {
                $group: {
                    _id: '$tags',
                    count: {$sum:  1}
                }
            },
            {
                $project:{
                    _id: 0,
                    name: '$_id',
                    count: '$count'
                }
            }
        ]).sort({count: -1});

        const all = {
            name : 'All',
            count: await FoodModel.countDocuments()
        }
        tags.unshift(all)
        res.send(tags)
}))

//API to get food by tag
router.get("/tag/:tagName", asyncHandler (
    async (req, res) => {
    const foods = await FoodModel.find({tags: req.params.tagName})
    res.send(foods);
}))

//API to get food by id
router.get("/:foodId", asyncHandler (
    async (req, res) => {
    const food = await FoodModel.findById(req.params.foodId)
    
    res.send(food);
}))

export default router;