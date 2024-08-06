const React = require('react');
const Table = require('react-table').default;

import eventEmitter from './eventEmitter';

class TableComponent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: this.getDefaultData() // Initialize with default data
    };

    // Listen for the table update event
    eventEmitter.on('circleGroupClicked', (newData) => {
      this.setState({ data: [newData] });
    });
  }

  getColumns() {
    if (this.props.columns) {
      if (this.props.columns.length && typeof this.props.columns[0] === 'string') {
        return this.props.columns.map((d) => {
          return {
            Header: d,
            accessor: d
          };
        });
      }
      return this.props.columns;
    }
    if ((this.props.data || []).length) {
      return Object.keys(this.props.data[0]).map((d) => {
        return {
          Header: d,
          accessor: d
        };
      });
    }

    // Default headers if no columns or data are provided
    return [
      { Header: 'Ground Truth Label', accessor: 'groundTruthLabel' },
      { Header: 'Original Prediction', accessor: 'originalPrediction' },
      { Header: 'Current Prediction', accessor: 'currentPrediction' }
    ];
  }

  getDefaultData() {
    // Default rows if no data is provided
    return [
      {
        groundTruthLabel: 'Panda',
        originalPrediction: 'Panda',
        currentPrediction: 'Gibbon'
      }
    ];
  }

  render() {
    const { idyll, hasError, updateProps, children, ...props } = this.props;
    return (
      <Table
        className={`table ${this.props.className || ''}`}
        showPagination={this.state.data.length > this.props.defaultPageSize}
        minRows={this.state.data.length <= this.props.defaultPageSize ? this.state.data.length : undefined}
        data={this.state.data}
        children={undefined}
        columns={this.getColumns()}
      />
    );
  }
}

TableComponent.defaultProps = {
  data: [],
  showPageSizeOptions: false,
  showPageJump: false,
  defaultPageSize: 20
};

TableComponent._idyll = {
  name: "Table",
  tagType: "closed",
  props: [{
    name: "data",
    type: "array",
    example: 'x'
  }, {
    name: "showPagination",
    type: "boolean",
    example: 'false'
  }, {
    name: "showPageSizeOptions",
    type: "boolean",
    example: 'false'
  }, {
    name: "showPageJump",
    type: "boolean",
    example: 'false'
  }]
};

export default TableComponent;
