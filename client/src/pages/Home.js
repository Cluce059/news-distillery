import React, { useEffect, useState } from "react";
import CardBox from '../components/CardBox';
import {  Container, Form, Button, Col } from 'react-bootstrap';
import Auth from '../utils/Auth';
import { useMutation } from '@apollo/react-hooks';
import { GET_ME } from '../utils/queries';
import { SAVE_ARTICLE } from "../utils/mutations";
import { saveArticleIds, getSavedArticleIds } from "../utils/localStorage";
import { searchArticles } from '../utils/API';


const Home = () => {
//create state to hold articles from api data
    const [displayArticles, setDisplayArticles] =  useState([]);
    //search initially empty
    const [searchInput, setSearchInput] = useState('');
    const [savedArticleIds, setSavedArticleIds] = useState(getSavedArticleIds());
    const [saveArticle, { error }] = useMutation(SAVE_ARTICLE);
    // set up useEffect hook to save `savedarticles` 
    //list to localStorage on component unmount too keep pwa functionality
//possible to set unmount to after 2 weeks of no use?
    //method to display api data 

    useEffect(() => {
        return () => saveArticleIds(savedArticleIds);
    });

 //called onclick of save this article btn
 const handleSaveArticle= async(event) => {
     console.log(event.target)
    // const articleToSave = displayArticles.find((article) => article._id === articleId);
    // const token = Auth.loggedIn() ? Auth.getToken() : null;
    // if(!token){
    //     return false;
    // }

    // try {
    //    const { data } = await saveArticle({
    //        variables: {input: articleToSave}
    //    });
    //    if(error){
    //     throw new Error('something went wrong!');
    //    }
             // if book successfully saves to user's account, save book id to state
    //   setSavedArticleIds([...savedArticleIds, articleToSave.articleId]);
    // } catch (err) {
    //   console.error(err);
    // }
  };

    const handleShowArticles = async (event) => {
        //are we keeping the search option? if so this becomes a search btn handler 
        //could be cool to have articles populate the homepage at random for browsing until user searches for one
        event.preventDefault();


        if (!searchInput) {
            return false;
          }
      
          try {
              //response == api fetch + query
            const response = await searchArticles(searchInput);
      
            if (!response.ok) {
              throw new Error('something went wrong!');
            }
      
            const { articles } = await response.json();
  
            const articleData = articles.map((article) => ({
                articleId: article.publishedAt,
                author: article.author,
                title: article.title,
                description: article.description,
                url: article.url,
                urlToImage: article.urlToImage,
                handleSave: (e) => handleSaveArticle(e)

              }))
          
              //if not search, just display a bunch of fetched articles of a certain type?
              setDisplayArticles(articleData)
            setSearchInput('')
          } catch (err) {
            console.error(err);
          }
    };

       return (
          <>
        <Container>
          <h1 className="text-center text-dark ">Search for Endless Articles!</h1>
          <Form onSubmit={handleShowArticles}>
            <Form.Row>
              <Col xs={12} md={11}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Search for an article!'
                />
              </Col>
              <Col xs={12} md={1}>
                <Button type='submit' variant='dark' size='lg'>
                  Search
                </Button>
              </Col>
            </Form.Row>
          </Form>
        </Container>
        <CardBox articles={displayArticles} handleSave={handleSaveArticle}/>

        </>
      )
};

export default Home;

