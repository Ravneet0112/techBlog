const router = require('express').Router();
const { User, Post, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
    try {
        const postData = await Post.findAll({
            attributes: ['id', 'title', 'content', 'date_created'],
        include: [
            {
            model: User,
            attributes: ['username'],
            },
        ],
        });
    
        const posts = postData.map((post) => post.get({ plain: true }));
    
        res.render('homepage', {
        posts,
        logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
    });

router.get('/post/:id', async (req, res) => {
    try{
        const postData = await Post.findByPk(req.params.id, {
            attributes: ['id', 'title', 'content', 'date_created'],
            include: [
                {
                    model: User,
                    attributes: ['username'],
                },
            ],
        });
        const post = postData.get({ plain: true });
        res.render('post', {
            ...post,
            logged_in: req.session.logged_in
        });
    }
    catch (err) {
        res.status(500).json(err);
    }
});

router.get('/login', withAuth, async(req, res) => {
    try {
        const userData = await User.findByPk(req.session.username_id, {
            attributes: { exclude: ['password'] },
            include: [{ model: Post }],
        });
        const user = userData.get({ plain: true });
        
        res.render('login', {...user,
            logged_in: true
            });
    } catch (err) {
        res.status(500).json(err);
    }
});


router.get('/signup', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/');
        return;
    }
    res.render('signup');
});

module.exports = router;