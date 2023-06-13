const request = require("supertest");
const app = require('../app');
const db = require("../db");
const Book = require("../models/book");

process.env.NODE_ENV = "test"

describe("Books Routes Tests", function() {
	beforeEach(async function() {
		await db.query("DELETE FROM books");

		const book1 = Book.create(
			{
				"isbn": "0691161518",
				"amazon_url": "http://a.co/eobPtX2",
				"author": "Matthew Lane",
				"language": "english",
				"pages": 264,
				"publisher": "Princeton University Press",
				"title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
				"year": 2017
			}
		)

		const book2 = Book.create(
			{
				"isbn": "123456",
				"amazon_url": "http://a.co/eobPtX2",
				"author": "James Stewart",
				"language": "english",
				"pages": 264,
				"publisher": "Happy Pages",
				"title": "GET IT BABY",
				"year": 2018
			}
		)
	})

	describe("GET /", function() {
		test("gets all books", async function(){
			let response = await request(app)
				.get("/books/0691161518")
			console.log(response.body)
			expect(response.statusCode).toEqual(200);
			expect(response.body).toStrictEqual({ "book" : {
				"isbn": "0691161518",
				"amazon_url": "http://a.co/eobPtX2",
				"author": "Matthew Lane",
				"language": "english",
				"pages": 264,
				"publisher": "Princeton University Press",
				"title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
				"year": 2017
			}})
		})
	})

	describe("GET /:id", function() {
		test("gets single book", async function(){
			let response = await request(app)
				.get("/books")
			console.log(response.body)
			expect(response.statusCode).toEqual(200);
			expect(response.body).toStrictEqual({ "books" : [
				{
					"isbn": "123456",
					"amazon_url": "http://a.co/eobPtX2",
					"author": "James Stewart",
					"language": "english",
					"pages": 264,
					"publisher": "Happy Pages",
					"title": "GET IT BABY",
					"year": 2018
				},
				{
					"isbn": "0691161518",
					"amazon_url": "http://a.co/eobPtX2",
					"author": "Matthew Lane",
					"language": "english",
					"pages": 264,
					"publisher": "Princeton University Press",
					"title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
					"year": 2017
				}
				]
			})
		})
	})

	describe("POST /", function() {
		test("add book", async function(){
			let response = await request(app)
				.post("/books")
				.send({
					"isbn": "23425234",
					"amazon_url": "http://asdf.i.com",
					"author": "TESTER",
					"language": "GA",
					"pages": 456,
					"publisher": "Holly Molly",
					"title": "Writing for Dummmies",
					"year": 1895
				})
			expect(response.body).toStrictEqual({ "book" : {
				"isbn": "23425234",
				"amazon_url": "http://asdf.i.com",
				"author": "TESTER",
				"language": "GA",
				"pages": 456,
				"publisher": "Holly Molly",
				"title": "Writing for Dummmies",
				"year": 1895
			}})
		})
		test("add book with invalid info", async function(){
			let response = await request(app)
				.post("/books")
				.send({
					"amazon_url": "http://asdf.i.com",
					"author": "TESTER",
					"language": "GA",
					"pages": 456,
					"publisher": "Holly Molly",
					"title": "Writing for Dummmies",
					"year": 1895
				})
			expect(response.statusCode).toEqual(400)
		})
		
	})
	describe("PUT /:isbn", function() {
		test("update book", async function(){
			let response = await request(app)
				.put("/books/0691161518")
				.send({
					"amazon_url": "http://asdf.i.com",
					"author": "TESTER UPDATE",
					"language": "spanish",
					"pages": 456,
					"publisher": "Holly Molly",
					"title": "Writing for Dummmies",
					"year": 1895
				})
			expect(response.body).toStrictEqual(
				{ book: {
					"isbn" : "0691161518",
					"amazon_url": "http://asdf.i.com",
					"author": "TESTER UPDATE",
					"language": "spanish",
					"pages": 456,
					"publisher": "Holly Molly",
					"title": "Writing for Dummmies",
					"year": 1895
				}}
			)
		})
		test("update book with invalid data", async function(){
			let response = await request(app)
				.put("/books/0691161518")
				.send({
					"amazon_url": "http://asdf.i.com",
					"language": "spanish",
					"pages": 456,
					"publisher": "Holly Molly",
					"title": "Writing for Dummmies",
					"year": 1895
				})
			expect(response.statusCode).toEqual(400)
		})
	})
})

afterAll(async function () {
	await db.end();
  });