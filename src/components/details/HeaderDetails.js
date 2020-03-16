import React from "react";
import styled from "styled-components";
import Map from "./Map";

const ContainerDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  color: white;
  font-family: Verdana;
  font-size: 14px;
  font-weight: bold;
  height: 100px;
  width: 774px;
`;

const Li = styled.li`
  margin: 2x 0;
`;

class HeaderDetails extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { loading: true };
  }

  componentDidMount() {
    fetch("http://10.0.0.230:8000/api/" + this.props.headerDetailsId)
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.setState({
          loading: false,
          dest: data._dest,
          port: data._port,
          mot: data._mot,
          carrier: data._carrier,
          billNo: data._billno,
          fromCoord: [
            data._fromcoord ? data._fromcoord.x : null,
            data._fromcoord ? data._fromcoord.y : null
          ],
          toCoord: [
            data._tocoord ? data._tocoord.x : null,
            data._tocoord ? data._tocoord.y : null
          ],
          offset: data._billno
        });
      });
  }

  render() {
    if (this.state.loading) {
      return <h1>loading … </h1>;
    }
    return (
      <ContainerDiv>
        <div>
          <ul style={{ listStyleType: "none" }}>
            <Li>{`Dest: ${this.state.dest.toUpperCase()}`}</Li>
            <Li>{`Port: ${this.state.port.toUpperCase()}`}</Li>
            <Li>{`MOT: ${this.state.mot.toUpperCase()}`}</Li>
            <Li>{`Carrier: ${this.state.carrier.toUpperCase()}`}</Li>
            <Li>{`Bill#: ${this.state.billNo.toUpperCase()}`}</Li>
          </ul>
        </div>
        <div style={{ width: 260 }}>
          {!this.state.toCoord[0] ? null : (
            <Map
              fromCoord={this.state.fromCoord}
              toCoord={this.state.toCoord}
              destination={this.state.dest}
              offset={this.state.offset}
            />
          )}
        </div>
      </ContainerDiv>
    );
  }
}

export default HeaderDetails;
