
const pool = require('./db');

// const { toTitleCase } = require('../lib/common-function/toTittleCase');


var product = {
    getAllProduct: function (req, callback) {
        pool.query("SELECT * FROM product ", function (err, result) {
            if (err) {
                response={
                    status:false,
                    message:"Error!! while fetching datas"
                }
         
                callback(err,response);
            }
               else {
               
                callback(null, result.rows);

            }

        });

    },
   
    addProduct: function (req, callback) {
  
      
        pool.query("INSERT INTO product (name,price,description,image_url,stock,specifications,brand_id,category_id,gender,frame_type, face_shape) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)", [req.name,req.price,req.description,req.image_url,req.stock,req.specifications,req.brand_id,req.category_id,req.gender,req.frame_type,req.face_shape], function (err, result) {
            // console.log(err,result );
            //    console.log(req,"req" );
            response={
                status:false,
                message:"Error!! while Inserting datas"
            }
            if (err) {
         
                callback(err, response);
            }
                else if(result.rowCount==0){
                callback("Error!!",response);

                }else {
                 
                callback(null, result);
            }

        });

    },
    getProductById: function (req, callback) {
        
        pool.query("SELECT * FROM product  where id=$1",[req.params.id], function (err, result) {
            response={
                status:false,
                message:"Error!! while fetching datas"
            }
            if (err) {
         
                callback(err, response);
            }
                else if(result.rowCount==0){
                callback("Error!!",response);

                } else {
               
                callback(null, result.rows);

           
            }

        });

    },
    updateProduct: function (req, callback) {
       const { name,price,description,image_url,stock,specifications,brand_id,category_id,gender,frame_type,face_shape } = req.body;
        const{id}=req.params;
        pool.query("UPDATE product SET name=$1,price=$2,description=$3, image_url=$4, stock=$5, specifications=$6,brand_id=$7, category_id=$8, gender=$9, frame_type=$10, face_shape=$11 WHERE id =$12", [name,price,description,image_url,stock,specifications,brand_id,category_id, gender,frame_type,face_shape, id], function (err, result) {
            //console.log(err,"update");
            
            response={
                status:false,
                message:"Error!! while updating datas"
            }
            if (err) {
         
                callback(err,response);
            }
                else if(result.rowCount==0){
                callback("Error!!",response);

                } else {
               
                callback(null, result);
            }
        

        });

    },
    
   	deleteProduct: function (req, callback) {
		pool.query(
			`DELETE FROM product WHERE id=$1`,
			[req.params.id],
			function (err, result) {
				if (err) {
					
					callback(err, 'Error!! while Deleting datas');
				} else if (result.rowCount == 0) {
					callback('Error!! while Deleting datas', 'Error!!');
				} else {
					callback(null, result);
				}
			}
		);
	},
   searchProductByName: function (req, callback) {
    const searchTerm = req.name || ''; // FIXED: no req.query here

    pool.query(`
        SELECT p.*, 
           c.name AS category_name, 
           c.description AS category_description, 
           b.name AS brand_name
    FROM product p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN brands b ON p.brand_id = b.id
    WHERE LOWER(p.name) LIKE LOWER($1)
       OR LOWER(c.name) LIKE LOWER($1)
       OR LOWER(b.name) LIKE LOWER($1)
    `, [`%${searchTerm}%`], function (err, result) {
        if (err) {
            console.log(err);
            return callback(err, {
                status: false,
                message: 'Error while searching product'
            });
        }

        callback(null, {
            status: true,
            message: 'Products retrieved successfully',
            data: result.rows
        });
    });
},
// searchProductByName: function (req, callback) {
//     const searchTerm = req.name || '';
//     const gender = req.gender || null;
//     const frameType = req.frame_type || null;
//     const faceShape = req.face_shape || null;

//     const query = `
//         SELECT p.*, 
//                c.name AS category_name, 
//                c.description AS category_description, 
//                b.name AS brand_name
//         FROM product p
//         LEFT JOIN categories c ON p.category_id = c.id
//         LEFT JOIN brands b ON p.brand_id = b.id
//         WHERE (
//             LOWER(p.name) LIKE LOWER($1) OR 
//             LOWER(c.name) LIKE LOWER($1) OR 
//             LOWER(b.name) LIKE LOWER($1)
//         )
//         AND ($2::text IS NULL OR LOWER(p.gender) = LOWER($2))
//         AND ($3::text IS NULL OR LOWER(p.frame_type) = LOWER($3))
//         AND ($4::text IS NULL OR LOWER(p.face_shape) = LOWER($4))
//     `;

//     const values = [
//         `%${searchTerm}%`, // $1
//         gender,            // $2
//         frameType,         // $3
//         faceShape          // $4
//     ];

//     pool.query(query, values, function (err, result) {
//         if (err) {
//             console.log(err);
//             return callback(err, {
//                 status: false,
//                 message: 'Error while searching product'
//             });
//         }

//         callback(null, {
//             status: true,
//             message: 'Products retrieved successfully',
//             data: result.rows
//         });
//     });
// },

 filterProduct: function (req, callback) {
    console.log("kjhjdf");
    
  const {
    category,
    brand,

    product,
    gender,
    frame_type,
    face_shape,
    minPrice,
    maxPrice
    
  } = req.query;

  pool.query(`
    SELECT p.*, 
           c.name AS category_name, 
           c.description AS category_description, 
           b.name AS brand_name
    FROM product p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN brands b ON p.brand_id = b.id
    WHERE
      ($1::text IS NULL OR LOWER(c.name) LIKE LOWER('%' || $1 || '%')) AND
      ($2::text IS NULL OR LOWER(b.name) LIKE LOWER('%' || $2 || '%')) AND
      ($3::text IS NULL OR LOWER(p.name) LIKE LOWER('%' || $3 || '%')) AND
       ($4::text IS NULL OR LOWER(p.gender) = LOWER($4)) AND
  ($5::text IS NULL OR LOWER(p.frame_type) = LOWER($5)) AND
  ($6::text IS NULL OR LOWER(p.face_shape) = LOWER($6)) AND
 ($7::numeric IS NULL OR p.price >= $7) AND
      ($8::numeric IS NULL OR p.price <= $8)
    ORDER BY p.id DESC
  `, [
    category || null,
    brand || null,
    product || null,
      gender || null,
    frame_type || null,
    face_shape || null,
    minPrice || null,
    maxPrice || null
  ], function (err, result) {
    if (err) {
      console.log(err);
      return callback(err, {
        status: false,
        message: 'Error while searching product'
      });
    }

    return callback(null, {
      status: true,
      message: 'Fliter Products successfully',
      data: result.rows
    });
  });
}

}

module.exports = product;