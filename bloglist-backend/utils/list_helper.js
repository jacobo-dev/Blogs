const  _ =  require ( 'lodash' );

const dummy = (blogs) => {
    return 1
  }
  
const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => {
        return sum + blog.likes
    }, 0)

}

const favoriteBlog  = (blogs) => {

    return blogs.reduce((max, blog) => {
        const fav = blog.likes > max.likes ? blog : max;
          return {
            title: fav.title,
            author: fav.author,
            likes: fav.likes
          }
    }, blogs[0]);
} 

const mostBlogs = (blogs) => {

    const authors = _.countBy(blogs, 'author');
    const mostBlogs = Object.entries(authors).reduce((max, author) => 
        author[1] > max[1] ? author : max
      );
    
    return{
        author: mostBlogs[0],
        blogs: mostBlogs[1]
      };
}

const mostLikes = (blogs) =>{
    const authors = _.groupBy(blogs, 'author')
    const likesByAuthor = Object.entries(authors).map(([author,blog])=>{
        const totalLikes= blog.reduce((sum, blo) => sum + blo.likes, 0)
        return  {author, likes: totalLikes}
    },)
    
    const liked = likesByAuthor.reduce((max,author) =>{
       return author.likes > max.likes ? author : max 
    },{author: '', likes: 0})

    return liked;
    
}

  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  }