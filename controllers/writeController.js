const Blog_Post = require('../models/blog_post'); 
const Category = require('../models/category');
const { v4: uuidv4 } = require('uuid');

const createBlogPost = async (req, res) => {
    try {
        const { category_name, blog_title, blog_image, content, status } = req.body;

        const user_id = req.user?.id || req.user?.user_id || req.user?.userId;

        if (!blog_title || !content || !category_name) {
            return res.status(400).json({ message: "Title, content, and category name are required." });
        }

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
            blog_image,
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

const editBlogDraft = async (req, res) => {
    try {
        const { blog_id } = req.params;
        const { category_name, blog_title, blog_image, content, status } = req.body;

        const user_id = req.user?.id || req.user?.user_id || req.user?.userId;
        if (!user_id) {
            return res.status(401).json({ message: "Authentication failed. Token missing." });
        }

        const post = await Blog_Post.findByPk(blog_id);
        if (!post) {
            return res.status(404).json({ message: "Target blog post draft could not be found." });
        }

        if (post.status !== 'draft') {
            return res.status(403).json({ 
                message: `Action denied. Blog status must be draft. Current status is '${post.status}'.` 
            });
        }

        if (post.user_id !== user_id) {
            return res.status(403).json({ message: "Access denied. You do not own this blog post draft." });
        }

        let category_id = post.category_id;
        if (category_name && category_name.trim() !== "") {
            const categoryRecord = await Category.findOne({
                where: { category_name: category_name.trim() }
            });
            if (!categoryRecord) {
                return res.status(404).json({ message: `Category '${category_name}' does not exist.` });
            }
            category_id = categoryRecord.category_id;
        }

        const finalImage = req.file ? req.file.location : (blog_image || post.blog_image);

        let currentStatus = post.status;
        if (status) {
            const allowedAuthorStatuses = ['draft', 'approval pending'];
            currentStatus = allowedAuthorStatuses.includes(status) ? status : post.status;
        }

        post.category_id = category_id;
        post.blog_title = blog_title || post.blog_title;
        post.blog_image = finalImage;
        post.content = content || post.content;
        post.status = currentStatus;

        await post.save();

        return res.status(200).json({
            message: "Blog post draft updated successfully.",
            data: post
        });
    } 
    catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const submitBlogForApproval = async (req, res) => {
    try {
        const { blog_id } = req.params;

        const user_id = req.user?.id || req.user?.user_id || req.user?.userId;
        if (!user_id) {
            return res.status(401).json({ message: "Authentication failed. Token missing." });
        }

        const post = await Blog_Post.findByPk(blog_id);
        if (!post) {
            return res.status(404).json({ message: "Blog post record could not be found." });
        }

        if (post.status !== 'draft') {
            return res.status(400).json({ 
                message: `Cannot submit. Only 'draft' posts can be sent for approval. Current status is '${post.status}'.` 
            });
        }

        post.status = 'approval pending';
        await post.save();

        return res.status(200).json({
            message: "Blog post successfully submitted to admin queue for approval and feedback.",
            data: {
                blog_id: post.blog_id,
                blog_title: post.blog_title,
                status: post.status,
                updated_at: post.updated_at
            }
        }); 
    } 
    catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

module.exports = {
    createBlogPost,
    editBlogDraft,
    submitBlogForApproval
};
