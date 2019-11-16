'use strict';

const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs').promises;

const ContentType = [
    {
        ext: 'csv',
        value: 'text/csv'
    },
    {
        ext: 'png',
        value: 'image/png'
    },
]

router.get('/', validateParam(), async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.status(400).end();
        return;
    }

    const filenames = req.query.file.split('.');
    const filepath = path.join('static', req.query.file);
    const file = await fs.readFile(filepath)
    .catch((error) => {
        console.log(error);
        res.status(404).end();
        return;
    });

    const contentTypes = getContentType(filenames[filenames.length - 1]);
    const headers = {
        'Content-Type': (contentTypes.length > 0) ? contentTypes[0].value : null,
        'Content-Disposition': 'attachment; ' + req.query.file
    };

    res.set(headers).send(file);
});

function validateParam() {
	return [
		check('file')
			.exists({checkNull: true})
    ];
}

function getContentType(ext) {
    return ContentType.filter((contentType) => {
        if (ext === contentType.ext) return contentType
    })
}

module.exports = router;