import React, { useCallback, useEffect, useState } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {
  const { category, country, pageSize, setProgress } = props;
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  // document.title = ` ${this.capitalizeFirstLetter(
  //   props.category
  // )} - NewsApp`;

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const updateNews = useCallback(async () => {
    setProgress(0);
    let url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=962f603a690c4815a41e19f530fe3656&page=1&pageSize=${pageSize}`;
    let data = await fetch(url);
    setProgress(20);
    let parsedData = await data.json();
    setProgress(60);
    console.log(parsedData);
    setArticles(parsedData.articles);
    setTotalResults(parsedData.totalResults);
    setPage(1);

    setProgress(100);
  }, [category, country, pageSize, setProgress]);

  useEffect(() => {
    updateNews();
  }, [updateNews]);

  // async componentDidMount() {
  // let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=962f603a690c4815a41e19f530fe3656&page=${props.page}&pageSize=${props.pageSize}`;
  // this.setState({ loading: true });
  // let data = await fetch(url);
  // let parsedData = await data.json();
  // console.log(parsedData);
  // this.setState({
  //   articles: parsedData.articles,
  //   totalResults: parsedData.totalResults,
  //   loading: false,
  // });
  // this.updateNews();
  // }

  const fetchMoreData = async () => {
    let url = `https://newsapi.org/v2/top-headlines?country=${
      props.country
    }&category=${category}&apiKey=962f603a690c4815a41e19f530fe3656&page=${
      page + 1
    }&pageSize=${pageSize}`;
    setPage(page + 1);
    let data = await fetch(url);
    let parsedData = await data.json();
    console.log(parsedData);
    setArticles(articles.concat(parsedData.articles));
    setTotalResults(parsedData.totalResults);
  };

  // console.log("inside render");
  return (
    <div className="container my-4">
      <h2
        className="text-center"
        style={{ margin: "25px 0px", marginTop: "90px" }}
      >
        NewsApp - Top {capitalizeFirstLetter(props.category)} Headlines
      </h2>
      {/* {this.state.loading && <Spinner />} */}

      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={articles.length < totalResults}
        loader={<Spinner />}
      >
        <div className="container">
          <div className="row">
            {articles.map((element) => {
              return (
                <div className="col-md-4" key={element.url}>
                  <NewsItem
                    title={element.title ? element.title : ""}
                    description={element.description ? element.description : ""}
                    imageUrl={element.urlToImage}
                    newsUrl={element.url}
                    author={element.author}
                    date={element.publishedAt}
                    source={element.source.name}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </InfiniteScroll>

      {/* <div className="container d-flex justify-content-between my-4">
          <button
            disabled={this.state.page <= 1}
            type="button"
            className="btn btn-secondary"
            onClick={this.handlePreviousClick}
          >
            &larr; Previous
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={this.handleNextClick}
          >
            Next &rarr;
          </button>
        </div> */}
    </div>
  );
};

News.defaultProps = {
  country: "us",
  pageSize: 8,
  category: "general",
};

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
  setProgress: PropTypes.func.isRequired,
};

export default News;
