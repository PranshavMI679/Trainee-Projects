const Blog_Post = require('../models/blog_post'); 
const Category = require('../models/category');
const { v4: uuidv4 } = require('uuid');

const createBlogPost = async (req, res) => {
    try {
        const { category_name, blog_title, content, status } = req.body;

        const user_id = req.user?.id || req.user?.user_id || req.user?.userId;

        if (!blog_title || !content || !category_name) {
            return res.status(400).json({ message: "Title, content, and category name are required." });
        }

        const blog_image = req.file ? req.file.location : "";

        const categoryRecord = await Category.findOne({
            where: { category_name: category_name.trim() }
        });

        if (!categoryRecord) {
            return res.status(404).json({ 
                message: `Category '${category_name}' does not exist. Please use an existing category.` 
            });
        }

        const category_id = categoryRecord.category_id;

        const allowedStatuses = ['draft', 'approval pending', 'approved', 'recheck', 'published'];
        const currentStatus = status && allowedStatuses.includes(status) ? status : 'draft';

        const newPost = await Blog_Post.create({
            blog_id: uuidv4(),
            user_id,
            category_id,
            blog_title,
            blog_image: blog_image,
            content,
            status: currentStatus
        });

        return res.status(201).json({
            message: "Blog post created successfully",
            data: newPost
        });
    } 
    catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

module.exports = {
    createBlogPost,
};
