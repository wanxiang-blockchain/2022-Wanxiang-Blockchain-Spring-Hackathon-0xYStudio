import { useParams } from "react-router-dom";
import styles from "../../styles/Home.module.scss";
import { Card, Row, Col } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";

export default () => {
  const { contract, token_id } = useParams();
  const [data, setData] = useState<any>();
  const [floor, setFloor] = useState<any>();
  useEffect(() => {
    const fetchData = async () => {
      let raw_data: any;
      let raw_floor = "";
      await axios
        .get(`https://api.opensea.io/api/v1/asset/${contract}/${token_id}`)
        .then(async function (response) {
          raw_data = response?.data;
        })
        .catch(function (error) {
          console.log(error);
        });
      if (raw_data) {
        let name = raw_data?.collection?.slug;
        await axios
          .get(`https://api.opensea.io/api/v1/collection/${name}/stats`)
          .then(function (response) {
            raw_floor = response?.data?.stats?.floor_price;
          })
          .catch(function (error) {
            console.log(error);
          });
      }
      setData(raw_data);
      setFloor(raw_floor);
    };
    fetchData();
  }, []);

  const timeConvert = (raw_date: string) => {
    if (raw_date) {
      var date = new Date(raw_date.slice(0, 10));
      var interval = new Date().getTime() - date.valueOf();
      var day = Math.ceil(interval / (1000 * 3600 * 24));
      return day;
    } else {
      return undefined;
    }
  };
  return (
    <div className={styles.verify}>
      <Row style={{ paddingTop: "3rem" }}>
        <Col span={8} offset={8}>
          <Card
            bodyStyle={{ backgroundColor: "black", display: "none" }}
            bordered={false}
            style={{ marginTop: "2rem", marginBottom: "1rem" }}
            cover={
              <img
                src={data?.image_url}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src =
                    "data:image/png;base64,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";
                }}
              />
            }
          ></Card>
        </Col>
      </Row>
      <div style={{ textAlign: "center" }}>
        <h3>{`${data?.asset_contract?.name} #${token_id}`}</h3>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          color: "white",
          paddingLeft: "1.5rem",
          fontSize: "1rem",
        }}
      >
        Owned by 26x14.eth
        <img
          alt="icon"
          src="https://img.icons8.com/color-glass/48/000000/approval.png"
          style={{ height: "1.5rem", width: "2rem", paddingLeft: "0.5rem" }}
        ></img>
      </div>
      <Row style={{ marginTop: "1rem" }}>
        <Col span={17} offset={4}>
          <div className={styles.card_out}>
            <Row>
              <Col span={6}>
                <div className={styles.card_in}>Amount</div>
              </Col>
              <Col span={6}>
                <div className={styles.card_in}>Cost</div>
              </Col>
              <Col span={6}>
                <div className={styles.card_in}>Floor</div>
              </Col>
              <Col span={6}>
                <div className={styles.card_in}>Hold</div>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <div className={styles.card_low}>
                  {data?.collection?.stats?.count}
                </div>
              </Col>
              <Col span={6}>
                <div className={styles.card_low}>
                  {Number(data?.last_sale?.total_price) / 1000000000000000000}Ξ
                </div>
              </Col>
              <Col span={6}>
                <div className={styles.card_low}>{floor}Ξ</div>
              </Col>
              <Col span={6}>
                <div className={styles.card_low}>
                  {data ? timeConvert(data?.last_sale?.event_timestamp) : 0}d
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
      {/* <Row>
      <Col span={18} offset={3}>
        <div style={{textAlign:"center"}}>
        <h1 style={{color:"white"}}>Story</h1>
        <p style={{"wordWrap":"break-word"}}>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>
        </div>
      </Col>
    </Row> */}
    </div>
  );
};
