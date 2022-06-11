import { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  AssetsQueryParams,
  PageInfo,
  RQUESTSTATUS,
  SeriesQueryParams,
} from "../components/Generate/components/types";

export const useAssets = (queryParams: AssetsQueryParams) => {
  const [assets, setAssets] = useState(null);
  const [pageInfo, setPageInfo] = useState<PageInfo>({
    previous: null,
    next: null,
  });
  const [status, setStatus] = useState<RQUESTSTATUS>("success");
  useEffect(() => {
    if (queryParams.owner) {
      setStatus("loading");
      axios
        .get("https://api.opensea.io/api/v1/assets", {
          params: queryParams,
        })
        .then((response) => {
          setAssets(response.data?.assets);
          setPageInfo({
            previous: response.data.previous,
            next: response.data.next,
          });
          setStatus("success");
        })
        .catch((e) => {
          setStatus("err");
        });
    }
  }, [queryParams]);
  return { assets, pageInfo, status };
};

export const useSeries = (account) => {
  let loadPageCount = useRef(0); //init load page number
  const [series, setSeries] = useState<any[]>([]);
  const [fetching, setFetching] = useState(false);
  const seriesRef = useRef<any[]>([]);
  const [pageInfoSeries, setPageInfoSeries] = useState<PageInfo>({
    previous: null,
    next: null,
  });
  const [queryParmsSeries, setQueryParmsSeries] = useState<SeriesQueryParams>({
    offset: 0,
    limit: 300,
    asset_owner: account,
  });
  useEffect(() => {
    if (account && queryParmsSeries.asset_owner) {
      setFetching(true);
      const loadData = async () => {
        let response = await axios.get(
          "https://api.opensea.io/api/v1/collections",
          {
            headers: {
              Authorization: "1af61ace-cf34-4d0a-9daa-010ddb60041b",
            },
            params: queryParmsSeries,
          }
        );

        let data = response.data ? response.data : [];
        let seriesData = [];
        Array.isArray(data) &&
          data?.forEach((series) => {
            seriesData = seriesData.concat(series.primary_asset_contracts);
          });
        setSeries((prevSeries) => {
          seriesRef.current = prevSeries.concat(seriesData);
          return seriesRef.current;
        });
        setPageInfoSeries({
          previous: queryParmsSeries.offset !== 0 ? "true" : null,
          next: response.data.length === queryParmsSeries.limit ? "true" : null,
        });
        setFetching(false);
        loadPageCount.current += 1;
      };
      loadData();
    }
    return () => {
      if (loadPageCount.current < 4) {
        loadPageCount.current += 1;
        setQueryParmsSeries((seriesQuery) => {
          return {
            ...seriesQuery,
            offset: seriesQuery.offset + seriesQuery.limit,
            asset_owner: account,
          };
        });
      }
    };
  }, [queryParmsSeries, account]);

  //用户登录后重新加载数据
  useEffect(() => {
    setQueryParmsSeries({
      offset: 0,
      limit: 300,
      asset_owner: account,
    });
    loadPageCount.current = 0;
  }, [account]);

  return {
    series,
    fetching,
    seriesRef,
    pageInfoSeries,
    queryParmsSeries,
    setQueryParmsSeries,
    setSeries,
    setFetching,
  };
};
