package org.movieproject.posts.repository.search;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.JPQLQuery;
import org.movieproject.posts.dto.PageRequestDTO;
import org.movieproject.posts.dto.PostsDTO;
import org.movieproject.posts.entity.Posts;
import org.movieproject.posts.entity.QPosts;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

import java.util.List;

public class PostSearchImpl extends QuerydslRepositorySupport implements PostSearch {
    //  PostSearchImpl :  QuerydslRepositorySupport 상속받고 PostSearch 인터페이스 구현
    public PostSearchImpl() {super(Posts.class);}

    @Override
    public Page<Posts> search1(Pageable pageable) {

        //  Q도메인 생성
        QPosts posts = QPosts.posts;

        //  Query 작성
        JPQLQuery<Posts> query = from(posts);       //  select ... from posts

        //  BooleanBuilder() 사용
        BooleanBuilder booleanBuilder = new BooleanBuilder();       //   (

        booleanBuilder.or(posts.postTitle.contains(""));    //  title like
        booleanBuilder.or(posts.postContent.contains(""));  //  content like

        query.where(booleanBuilder);        // )
        query.where(posts.postId.gt(0L));   //  postId > 0

        //  Paging
        this.getQuerydsl().applyPagination(pageable, query);

        List<Posts> title = query.fetch();

        long count = query.fetchCount();

        return null;
    }

    @Override
    public Page<Posts> searchAll(String[] types, String keyword, Pageable pageable) {

        QPosts posts = QPosts.posts;

        JPQLQuery<Posts> query = from(posts);

        if( ( types != null && types.length > 0 ) && keyword != null) { //  검색 조건 및 키워드가 있는 경우
            BooleanBuilder booleanBuilder = new BooleanBuilder();   //  (

            for(String type : types) {
                switch (type) {
                    case "title":
                        booleanBuilder.or(posts.postTitle.contains(keyword));
                        break;
                    case "content":
                        booleanBuilder.or(posts.postContent.contains(keyword));
                        break;
                    case "writer":
                        booleanBuilder.or(posts.writer.contains(keyword));
                        break;
                }
            }   //  end for
            query.where(booleanBuilder);    //  )

        }   //  end if

        //  postId > 0
        query.where(posts.postId.gt(0L));

        //  paging
        this.getQuerydsl().applyPagination(pageable, query);

        List<Posts> list = query.fetch();

        long count = query.fetchCount();

        //  Page<T> 형식으로 변환 : Page<Posts>
        //  PageImpl을 통해서 반환 : list - 실제 목록 데이터, pageable, total - 전체 개수)
        return new PageImpl<>(list, pageable, count);
    }
}
