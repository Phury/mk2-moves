String.prototype.replaceAll = function(search, replace) {
    if (replace === undefined) {
        return this.toString();
    }
    return this.split(search).join(replace);
}

function _commandToHtml(command) {
  return {__html: command
    .replaceAll('Forward', '<span class="glyphicon glyphicon-arrow-right" aria-hidden="true"></span>')
    .replaceAll('Down', '<span class="glyphicon glyphicon-arrow-down" aria-hidden="true"></span>')
    .replaceAll('Back', '<span class="glyphicon glyphicon-arrow-left" aria-hidden="true"></span>')
    .replaceAll('Up', '<span class="glyphicon glyphicon-arrow-up" aria-hidden="true"></span>') 
  }
}


var CommandTableRow = React.createClass({
  render: function() {
    var moves = this.props.moves;
    var moveList = moves.map(function(elt, i){
      var moveName = Object.keys(elt)[0];
      var moveCmd = elt[moveName];
      return (
        <tr key={i}>
            <th>{moveName}:</th>
            <td dangerouslySetInnerHTML={_commandToHtml(moveCmd)}></td>
        </tr>
      );
    });
    return (
      <tbody>
          {moveList}
      </tbody>
    );
  }
});

var FighterPanel = React.createClass({
  render: function() {
    //console.log(this.props.fighter);
    var morphs;
    if (this.props.fighter.morphs) {
      morphs = (
        <div>
          <h4>Morphs</h4>
          <table className='table table-striped'>
            <CommandTableRow moves={this.props.fighter.morphs} />
          </table>
        </div>
      );
    }
    return (
      <div className='fighterPanel panel'>
          <div className='smove-head'>
              <img id={'avatar-'+this.props.fighter.id} className='avatar' src='img/img_trans.gif' />
              <h3 id={this.props.fighter.id}>{this.props.fighter.name}</h3>
          </div>
          <div className='smove-body'>
              <div>
                <h4>Special Moves</h4>
                <table className='table table-striped'>
                    <CommandTableRow moves={this.props.fighter.specials} />
                </table>
              </div>
              {morphs}
              <div>
                <h4>Finishers</h4>
                <table className='table table-striped'>
                  <CommandTableRow moves={this.props.fighter.finishers} />
                </table>
              </div>
          </div>
      </div>
    );
  }
});


var FighterList = React.createClass({
  getInitialState: function() {
    return {
      fighters: []
    };
  },

  componentDidMount: function() {
    this.serverRequest = $.getJSON(this.props.source, function(data) {
      this.setState({
        fighters: data
      });
    }.bind(this));
  },

  componentWillUnmount: function() {
    this.serverRequest.abort();
  },
  
  render: function() {
    var fighterList = this.state.fighters.map(function(elt) {
      return (
        <FighterPanel fighter={elt} key={elt.id} />
      );
    });
    return (
      <div className="fighterList">
        {fighterList}
      </div>
    );
  }
});
ReactDOM.render(
  <FighterList source='/mk2/data/mk2.json' />,
  document.getElementById('app')
);