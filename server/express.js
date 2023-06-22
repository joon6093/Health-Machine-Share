//20190633 송제용
import express from 'express';
import mysql from 'mysql';
import bodyParser from 'body-parser';
import cors from 'cors';
import multer from 'multer';
import dbconf from './conf/auth.js';

const app = express();
const port = 3010;

const db = mysql.createConnection(dbconf);

db.connect();

app.use(cors());
app.use(bodyParser.json());

// 브랜드이미지 저장 경로
const brandImageStorage = multer.diskStorage({
    destination: '/workspace/HealthMachineProject/client/public/brand_images',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
// 머신이미지 저장 경로
const machineImageStorage = multer.diskStorage({
    destination: '/workspace/HealthMachineProject/client/public/machine_images',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const uploadBrandImage = multer({ storage: brandImageStorage });
const uploadMachineImage = multer({ storage: machineImageStorage });

// 사용자 등록 API에 대한 POST 요청 처리
app.post('/HealthMachineShare/users/register', (req, res) => {
    const { username, password } = req.body;

    // 등록된 사용자인지 확인하기 위해 DB에서 사용자 검색
    const checkUserQuery = `SELECT * FROM users WHERE username = '${username}';`;
    db.query(checkUserQuery, (err, result) => {
        if (err) {
            res.status(500).json({ message: '서버 오류' });
            return console.log(err);
        }

        if (result.length > 0) {
            res.status(400).json({ message: '이미 등록된 사용자 이름입니다.' });
        } else {
            // 새로운 사용자 등록
            const insertUserQuery = `INSERT INTO users (username, password) VALUES ('${username}', '${password}');`;
            db.query(insertUserQuery, (err, result) => {
                if (err) {
                    res.status(500).json({ message: '서버 오류' });
                    return console.log(err);
                }
                res.json({ userId: result.insertId, message: '사용자 등록이 완료되었습니다.' });
            });
        }
    });
});

// 로그인 API에 대한 POST 요청 처리
app.post('/HealthMachineShare/users/login', (req, res) => {
    const { username, password } = req.body;

    // 사용자명과 비밀번호를 검증하기 위해 DB에서 사용자 검색
    const loginUserQuery = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}';`;
    db.query(loginUserQuery, (err, result) => {
        if (err) {
            res.status(500).json({ message: '서버 오류' });
            return console.log(err);
        }

        if (result.length > 0) {
            res.json({ userId: result[0].user_id, message: '로그인이 완료되었습니다.' });
        } else {
            res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' });
        }
    });
});

// 사용자 목록 API에 대한 GET 요청 처리
app.get('/HealthMachineShare/users', (req, res) => {
    // DB에서 모든 사용자 가져오기
    const getUsersQuery = 'SELECT * FROM users;';
    db.query(getUsersQuery, (err, result) => {
        if (err) {
            res.status(500).json({ message: '서버 오류' });
            return console.log(err);
        }
        res.json({ users: result });
    });
});

// 머신 목록 API에 대한 GET 요청 처리
app.get('/HealthMachineShare/machines', (req, res) => {
    // 머신 정보와 해당 머신의 브랜드 정보를 조인하여 가져오는 SQL 쿼리
    const sql = `SELECT machines.machine_id ,machines.name AS machine_name, machines.description, machines.image_name AS machine_image,
       			brands.name AS brand_name, brands.founding_year, brands.image_name AS brand_image
				FROM machines
				INNER JOIN brands ON machines.brand_id = brands.brand_id;
`;

    db.query(sql, (err, rows) => {
        if (err) {
            res.json({ result: 'error' });
            return console.log(err);
        }
        res.json({ machines: rows });
    });
});

// 브랜드 정보 등록 API에 대한 POST 요청 처리
app.post('/HealthMachineShare/brands', uploadBrandImage.single('image'), (req, res) => {
    const { name, country, founding_year } = req.body;
    const image = req.file.filename;

    // 등록된 브랜드인지 확인하기 위해 DB에서 브랜드 검색
    const checkBrandQuery = `SELECT * FROM brands WHERE name = ?;`;
    db.query(checkBrandQuery, [name], (err, result) => {
        if (err) {
            res.status(500).json({ message: '서버 오류' });
            return console.log(err);
        }

        if (result.length > 0) {
            res.status(400).json({ message: '이미 등록된 브랜드 이름입니다.' });
        } else {
            // 새로운 브랜드 등록
            const insertBrandQuery = `INSERT INTO brands (name, country, founding_year, image_name) VALUES (?, ?, ?, ?);`;
            db.query(insertBrandQuery, [name, country, founding_year, image], (err, result) => {
                if (err) {
                    res.status(500).json({ message: '서버 오류' });
                    return console.log(err);
                }
                res.json({
                    brandId: result.insertId,
                    message: '브랜드 정보 등록이 완료되었습니다.',
                });
            });
        }
    });
});

// 브랜드 정보 목록 보기 API에 대한 GET 요청 처리
app.get('/HealthMachineShare/brands', (req, res) => {
    // DB에서 모든 브랜드 가져오기
    const getBrandsQuery = 'SELECT * FROM brands;';
    db.query(getBrandsQuery, (err, result) => {
        if (err) {
            res.status(500).json({ message: '서버 오류' });
            return console.log(err);
        }

        res.json({ brands: result });
    });
});

// 머신 정보 등록 API에 대한 POST 요청 처리
app.post(
    '/HealthMachineShare/machines/register',uploadMachineImage.single('image'),
    (req, res) => {
        const { brand, name, description } = req.body;
        const image = req.file.filename;

        // 등록된 브랜드의 brand_id 가져오기
		const getBrandIdQuery = 'SELECT brand_id FROM brands WHERE name = ?';
		db.query(getBrandIdQuery, [brand], (err, brandResult) => {
			if (err) {
				console.log(err);
				return res.status(500).json({ message: '서버 오류' });
			}

			const brandId = brandResult[0].brand_id;

			// 새로운 머신 등록
			const insertMachineQuery =
				'INSERT INTO machines (brand_id, name, description, image_name) VALUES (?, ?, ?, ?)';
			db.query(insertMachineQuery, [brandId, name, description, image], (err, result) => {
				if (err) {
					console.log(err);
					return res.status(500).json({ message: '서버 오류' });
				}
				res.json({
					machineId: result.insertId,
					message: '머신 정보 등록이 완료되었습니다.',
				});
			});
		});
    }
);

// 머신 평점 및 리뷰 등록 API에 대한 POST 요청 처리
app.post('/HealthMachineShare/machines/reviews/register/:machineId', (req, res) => {
    const { machineId } = req.params;
    const { userId, rating, review } = req.body;

    // 머신 평점 및 리뷰 등록
    const insertReviewQuery = `INSERT INTO ratings_reviews (machine_id, user_id, rating, review) VALUES (${machineId}, ${userId}, ${rating}, '${review}');`;
    db.query(insertReviewQuery, (err, result) => {
        if (err) {
            res.status(500).json({ message: '서버 오류' });
            return console.log(err);
        }
        res.json({ message: '평점 및 리뷰가 제출되었습니다.' });
    });
});

// 리뷰 및 평점 목록 조회 API에 대한 GET 요청 처리
app.get('/HealthMachineShare/machines/reviews/:machineId', (req, res) => {
    const { machineId } = req.params;
    const sql = `SELECT ratings_reviews.rating_id, machines.name AS machine_name, users.username AS user_name, ratings_reviews.rating, ratings_reviews.review
               FROM ratings_reviews
               LEFT JOIN machines ON ratings_reviews.machine_id = machines.machine_id
               LEFT JOIN users ON ratings_reviews.user_id = users.user_id WHERE machines.machine_id = ?;`;

    db.query(sql, [machineId], (err, rows) => {
        if (err) {
            console.log(err);
            return res.json({ result: 'error' });
        }
        res.json({ reviews: rows });
    });
});

// 머신 리뷰 및 평점 삭제 API에 대한 DELETE 요청 처리
app.delete('/HealthMachineShare/machines/reviews/:reviewId', (req, res) => {
    const { reviewId } = req.params;

    // 리뷰 삭제
    const deleteReviewQuery = `DELETE FROM ratings_reviews WHERE rating_id = ?;`;
    db.query(deleteReviewQuery, [reviewId], (err, result) => {
        if (err) {
            res.status(500).json({ message: '서버 오류' });
            return console.log(err);
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ message: '존재하지 않는 리뷰입니다.' });
        } else {
            res.json({ message: '리뷰가 삭제되었습니다.' });
        }
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
