import { useEffect, useState } from "react";
import USAIcon from "/icons/usa.png";
import JPYIcon from "/icons/jpn.png";
import EUIcon from "/icons/eu.png";
import UKIcon from "/icons/uk.png";
import SFIcon from "/icons/suisu.png";

export default function App() {
    const [data, setData] = useState(); //データを管理するステート(letより良い？っぽい)
    
    const [amount, setAmount] = useState("100");
    //カテゴリー欄変更により一時保存(カテゴリー欄と同期)
    const [keepAcountry, setKeepAcountry] = useState("USD");
    const [keepBcountry, setKeepBcountry] = useState("JPY");
    //handkeClick押下時に変更される
    const [Acountry, setAcountry] = useState("USD");
    const [Bcountry, setBcountry] = useState("JPY");
    const [exchangedAmount,setExchangedAmount] = useState("");
    //開いたとき、変更を加えたときに処理

    useEffect(() => {
      const fetchData = async () => {

        const url = await fetch("https://v6.exchangerate-api.com/v6/1c9d624b63ec437939cb13a5/latest/USD");
        //const url = await fetch(rate.json);
        const result = await url.json();
        setData(result);
      };
  
      fetchData();
    }, []);

    useEffect(() => {
      handleClick();
    
    }, [data]);

    //A国での通貨をB国での通貨価値に換算する
    async function fetchCountry(data, keepAcountry, keepBcountry) {

      const Arate = data.conversion_rates[keepAcountry];
      const Brate = data.conversion_rates[keepBcountry];

      const ratio = parseFloat(Brate) / parseFloat(Arate);
      return ratio;
    }


    function changeCountry(event) {
      event.preventDefault();
      const keep = keepAcountry;
      setKeepAcountry(keepBcountry);
      setKeepBcountry(keep);
    }

    async function handleClick(event) {
      //多分ボタンを押すイベントが起きたときはpreventして、
      //押していないときはpreventしないようにしている？
      event && event.preventDefault();
  
      const newRatio = await fetchCountry(data, keepAcountry, keepBcountry);
      const roundedValue = parseFloat((amount * newRatio).toFixed(2));
      setExchangedAmount(roundedValue);
      setAcountry(keepAcountry);
      setBcountry(keepBcountry);
    }

  return (
    <>
      <header>
        <h1>為替レート検索</h1>
      </header>
      <div>
        <aside>
          <form className="form1">
            {/*label表示*/}
            <div className="div0">
              <label htmlFor="category">両替元</label>
              <label htmlFor="category">両替先</label>  
            </div>
            {/*国変更*/}
            <div className="div1">
              <select className="a"
                id="category" 
                //asyncは必要ない
                onChange={(event) => setKeepAcountry(event.target.value)}
                value={keepAcountry}//valueを用いて表示を変更する
              >
                {data && Object.keys(data.conversion_rates).map((countryCode) => (
                    <option key={countryCode} value={countryCode}>
                        {countryCode}
                    </option>
                ))}
              </select>

              <p>→</p>

              <select className="b"
                id="category2" 
                onChange={(event) => setKeepBcountry(event.target.value)}
                value={keepBcountry}//valueを用いて表示を変更する
              >
                {data && Object.keys(data.conversion_rates).map((countryCode) => (
                    <option key={countryCode} value={countryCode}>
                        {countryCode}
                    </option>
                ))}
              </select>
            </div>
            <ul className="sets-container">
              <li className="set">
                <img
                  className="icon"
                  src={USAIcon}
                  alt="USA"
                  onClick={() => setKeepAcountry("USD")}
                />
                <img
                  className="icon"
                  src={UKIcon}
                  alt="UK"
                  onClick={() => setKeepAcountry("GBP")}
                />
                <img
                  className="icon"
                  src={JPYIcon}
                  alt="JPY"
                  onClick={() => setKeepAcountry("JPY")}
                />
                <img
                  className="icon"
                  src={EUIcon}
                  alt="EU"
                  onClick={() => setKeepAcountry("EUR")}
                />
                <img
                  className="icon"
                  src={SFIcon}
                  alt="suisu"
                  onClick={() => setKeepAcountry("CHF")}
                />
              </li>
              {/*国変更ボタン*/}
              {/*Enterキーでの誤実行を防ぐための処置 */}
              <form>
                <button onClick={changeCountry}>⇌</button>
              </form>
              <li className="set">
                <img
                  className="icon"
                  src={USAIcon}
                  alt="USA"
                  onClick={() => setKeepBcountry("USD")}
                />
                <img
                  className="icon"
                  src={UKIcon}
                  alt="UK"
                  onClick={() => setKeepBcountry("GBP")}
                />
                <img
                  className="icon"
                  src={JPYIcon}
                  alt="JPY"
                  onClick={() => setKeepBcountry("JPY")}
                />
                <img
                  className="icon"
                  src={EUIcon}
                  alt="EU"
                  onClick={() => setKeepBcountry("EUR")}
                />
                <img
                  className="icon"
                  src={SFIcon}
                  alt="suisu"
                  onClick={() => setKeepBcountry("CHF")}
                />
              </li>
            </ul>
            {/**/}
            <div className="div3">
              <label htmlFor="enterAmount">金額入力欄:</label>
                <input 
                  type="text" 
                  id="enterAmount" 
                  placeholder="XXXX" 
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}         
                >
                </input>
                <button onClick={handleClick}>検索</button>
                {/* &&は左辺評価→右辺評価　右辺が真なら右辺の結果を出力 */} 
                {exchangedAmount !== null && (
                <h3>
                  {exchangedAmount} {Bcountry}
                </h3>
                )}                
            </div>
          </form>
        </aside>
      </div>
      <div className="maindiv">
        <main>
            {/*下に主要な国の通貨への両替だけピックアップして書くかも*/}
            <h1>
              USDから他国への為替レート
            </h1>
          <div className="main2">
            {data && (
               <table border="5" width="2000px" height="300px">
               <tr>
                 <th width="50%">通貨</th>
                 <th width="50%">レート (1$換算)</th>
               </tr>
               <tr>
                 <td>
                  <img
                    className="icon"
                    src={USAIcon}
                    alt="USA"
                  />
                  <span>USD</span>
                  </td>
                  <td>
                  <span>{data.conversion_rates.USD}.0000$</span>
                  </td>
               </tr>
               <tr>
                  <td>
                  <img
                    className="icon"
                    src={JPYIcon}
                    alt="JPY"
                  />
                 <span> JPY </span>
                 </td>
                 <td>{data.conversion_rates.JPY}¥</td>
               </tr>
               <tr>
                 <td>
                 <img
                  className="icon"
                  src={EUIcon}
                  alt="EU"
                 />
                 <span>EUR</span>
                 </td>
                 <td>{data.conversion_rates.EUR}€</td>
               </tr>
              </table> 
            )}
          </div>
        </main>
      </div>
      <footer>
        <div>日本大学文理学部情報科学科 Webプログラミングの演習課題</div>
        <div>5422021 望月晃星</div>
        
      </footer>
    </>
  );
}