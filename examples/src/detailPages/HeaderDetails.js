import React from "react";
import styled from "styled-components";
import Map from "./Map";
import { shippingData } from "../lib/testData";

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
    this.setState({ loading: false });
  }

  render() {
    return (
      <ContainerDiv>
        <div>
          {console.log(this.props)}
          <ul style={{ listStyleType: "none" }}>
            <Li>{`Dest: ${this.props.headerDetailsId.destination.toUpperCase()}`}</Li>
            <Li>{`Port: ${this.props.headerDetailsId.port.toUpperCase()}`}</Li>
            <Li>{`MOT: ${this.props.headerDetailsId.mot.toUpperCase()}`}</Li>
            <Li>{`Carrier: ${this.props.headerDetailsId.carrier.toUpperCase()}`}</Li>
            <Li>{`Bill#: ${this.props.headerDetailsId.billNo.toUpperCase()}`}</Li>
          </ul>
        </div>
        <div style={{ width: 260 }}>
          {this.state.loading ? null : (
            <Map
              fromCoord={this.props.headerDetailsId.fromCoord}
              toCoord={this.props.headerDetailsId.toCoord}
              destination={this.props.headerDetailsId.destination}
              offset={this.props.headerDetailsId.offset}
            />
          )}
        </div>
      </ContainerDiv>
    );
  }
}

export default HeaderDetails;
