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
    this.setState({ loading: false });
  }

  render() {
    return (
      <ContainerDiv>
        <div>
          <ul style={{ listStyleType: "none" }}>
            <Li>{`Dest: ${this.props.headerDetails.destination.toUpperCase()}`}</Li>
            <Li>{`Port: ${this.props.headerDetails.port.toUpperCase()}`}</Li>
            <Li>{`MOT: ${this.props.headerDetails.mot.toUpperCase()}`}</Li>
            <Li>{`Carrier: ${this.props.headerDetails.carrier.toUpperCase()}`}</Li>
            <Li>{`Bill#: ${this.props.headerDetails.billNo.toUpperCase()}`}</Li>
          </ul>
        </div>
        <div style={{ width: 260 }}>
          {this.state.loading ? null : (
            <Map
              fromCoord={this.props.headerDetails.fromCoord}
              toCoord={this.props.headerDetails.toCoord}
              destination={this.props.headerDetails.destination}
              offset={this.props.headerDetails.offset}
            />
          )}
        </div>
      </ContainerDiv>
    );
  }
}

export default HeaderDetails;
