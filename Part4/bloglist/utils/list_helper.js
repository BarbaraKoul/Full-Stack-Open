const dummy=(blogs)=>{
    return 1
}

const totalLikes=(blogs)=>{
    let sumLikes=null
    if(blogs.length>1){
        sumLikes=blogs.reduce((acc, curr)=>{return acc.likes+curr.likes}, 0)
    }
    else if(blogs.length===1){
        sumLikes=blogs[0].likes
    }
    return sumLikes
}

const favouriteBlog = (blogs) => {
  if (blogs.length === 0) return 0;
  
  return blogs.reduce((maxLikes, blog) => {
    return Math.max(maxLikes, blog.likes);
  }, 0);
};

module.exports={dummy, totalLikes, favouriteBlog}