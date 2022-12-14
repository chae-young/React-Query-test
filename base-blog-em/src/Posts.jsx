import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";

import { PostDetail } from "./PostDetail";
const maxPostPage = 10;

async function fetchPosts(pageNum) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${pageNum}`
  );
  return response.json();
}

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  const queryClient = useQueryClient()

  //현재페이지가 변경사항이 생길때마다 실행
  useEffect(()=>{
    if(currentPage < maxPostPage) {
      const nextPage = currentPage + 1
      queryClient.prefetchQuery(['posts',nextPage], () => fetchPosts(nextPage))
    }
  },[currentPage, queryClient])

  // replace with useQuery
  const {data,isError,isLoading,error} = useQuery(['posts',currentPage],() => fetchPosts(currentPage),{
    staleTime:2000,
    keepPreviousData:true,//이전 데이터 유지
  });
  if(isLoading) return <div>isLoading</div>
  if(isError) return <div>is Error!!{error.toString()}</div>

  return (
    <>
      <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => setSelectedPost(post)}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button 
          disabled={currentPage <= 1} 
          onClick={() => {  
            setCurrentPage((prevVal) => prevVal - 1)
          }}>
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button 
          disabled={ currentPage >= maxPostPage} 
          onClick={() => {  
            setCurrentPage((prevVal) => prevVal + 1)
          }}>
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
