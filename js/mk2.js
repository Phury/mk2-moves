String.prototype.replaceAll = function(search, replace) {
    if (replace === undefined) {
        return this.toString();
    }
    return this.split(search).join(replace);
}

function _commandToHtml(command) {
  return {__html: command
    .replaceAll('Forward', '<i class="material-icons">arrow_forward</i>')
    .replaceAll('Down', '<i class="material-icons">arrow_downward</i>')
    .replaceAll('Back', '<i class="material-icons">arrow_back</i>')
    .replaceAll('Up', '<i class="material-icons">arrow_upward</i>') 
  }
}


class CommandTableRow extends React.Component {
  render() {
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
}

class FighterPanel extends React.Component {
  render() {
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
}


class FighterList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { fighters: [] };
  }

  componentDidMount() {
    this.serverRequest = $.getJSON(this.props.source, function(data) {
      this.setState({ fighters: data });
      jqueryHandle();
    }.bind(this));
  }

  componentWillUnmount() {
    this.serverRequest.abort();
  }
  
  render() {
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
}

ReactDOM.render(
  <FighterList source='data/mk2.json' />,
  document.getElementById('app')
);

function jqueryHandle() {
  // Smooth scroll
  $(document).on('click', 'a[href^="#"]', function (event) {
      event.preventDefault();
      $('html, body').animate({
          scrollTop: $($.attr(this, 'href')).offset().top - 65
      }, 500);
  });
  
  // Close mobile navbar on clicks
  $(function(){ 
     var navMain = $(".navbar-collapse"); // avoid dependency on #id
     // "a:not([data-toggle])" - to avoid issues caused
     // when you have dropdown inside navbar
     navMain.on("click", "a:not([data-toggle])", null, function () {
         navMain.collapse('hide');
     });
 });
}