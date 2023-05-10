
import request from "supertest";
import app from "../server.js";


describe('/GET Products, Categories, Brands, User', () => {
    describe('/GET Products', () => {
        test('should respond an array of products', async () => { 
            const response=await request(app).get('/api/product/').send()
            expect(response.body).toBeInstanceOf(Array)
         })
         test('should respond a product', async () => { 
            const idProduct=1
            const response=await request(app).get(`/api/product/${idProduct}`)
            expect(response.status).toBe(200);
            expect(response.body.id).toBe(idProduct);
        })
    });
    
    describe('/GET Categories', () => {
        test('should respond an array of categories', async () => { 
            const response=await request(app).get('/api/category').send()
            expect(response.body.success).toEqual(true)
         })
         test('should respond a category', async () => { 
            const idCategory=1
            const response=await request(app).get(`/api/category/${idCategory}`)
            expect(response.status).toBe(200);
            expect(response.body.success).toEqual(true);
        })
    });
    
    describe('/GET Brands', () => {
        test('should respond an array of brands', async () => { 
            const response=await request(app).get('/api/manufacturer').send()
            expect(response.body).toBeInstanceOf(Array)
         })
        test('should respond a brand', async () => { 
            const idBrand=1
            const response=await request(app).get(`/api/manufacturer/${idBrand}`)
            expect(response.status).toBe(200);
            expect(response.body.id).toBe(idBrand);
        })
    });

    describe('/GET Users', () => {
        test('should respond an array of users', async () => { 
            const response=await request(app).get('/api/user').send()
            // expect(response.body).toBeInstanceOf(Array)
            expect(response.body.success).toEqual(false)
         })
         test('should respond a user', async () => { 
            const idUser=1
            const response=await request(app).get(`/api/user/${idUser}`)
            expect(response.status).toBe(200);
            expect(response.body.id).toBe(idUser);
        })
    });
});


describe('/POST Products, Categories, Brands, User', () => {
    describe('/POST Products', () => {
        
    });

    describe('/POST Categories', () => {
        test('should respond with a status code 201 and an object ', async() => { 
            const category={
                name:'prueba test'
            }
            const response=await request(app).post('/api/category/').send(category)
            expect(response.statusCode).toBe(201)
            expect(response.body.success).toEqual(true)
        })
    });

    describe('/POST Brands', () => {
        test('should respond with a status code 201 and an object ', async() => { 
            const brand={
                name:'prueba test'
            }
            const response=await request(app).post('/api/manufacturer/').send(brand)
            expect(response.statusCode).toBe(201)
            expect(response.body.success).toEqual(true)
        })
    });

    describe('/POST User', () => {
        test('should respond with a status code 201 and an object ', async() => { 
            const user={
                username:"user2",
                password:"12345",
                email:"user2@gmail.com"
            }
            const response=await request(app).post('/api/user').send(user)
            expect(response.statusCode).toBe(201)
            expect(response.body.success).toEqual(true)
        })
    });
    
});




