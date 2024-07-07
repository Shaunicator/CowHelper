import express from 'express';
const router = express.Router();


router.get('^/$|index(.html)?', (request, response) => {
    //response.sendFile('./index.html',{ root: '/site/wwwroot' });//web deploy
    response.sendFile('./index.html',{ root: '.' });//local
});
router.get('^/$|unit-info(.html)?', (request, response) => {
    //response.sendFile ('./unit-info.html',{ root: '/site/wwwroot' });//web deploy
    response.sendFile ('./unit-info.html',{ root: '.' });//local
});

export default router;