var Note = React.createClass({

	render: function() {
		var style = { backgroundColor: this.props.color };
		return (
			<div 
				className="note" style={style}>
				<span className="delete-note" onClick={this.props.onDelete}> x </span>
				{this.props.children}
			</div>
		);
	}
});

var NoteEditor = React.createClass({

	getInitialState() {
		return {
			text: '',
			color: '#FFD700'
		};
	},

	handleTextChange: function(event){
		this.setState({
			text: event.target.value
		});
	},

	handleNoteAdd: function(){
		if (this.state.text.trim() != ''){
			var newNote ={
 			text: this.state.text,
 			color: this.state.color,
 			id: Date.now()
 		};

 		this.props.onNoteAdd(newNote);
 		this.setState({ text: '' });
 		this.setState({ color: '#FFD700'});
		}
	},

	handleColorChoosed: function(color){
		this.setState({ color: color.color });
	},

	render: function() {
		var style = { backgroundColor: this.state.color };
		return (
			<div 
				className="note-editor">
					<textarea 
						placeholder="Enter your text here..." 
						rows={5} 
						className="textarea" 
						value={this.state.text}
						onChange={this.handleTextChange}
						style={style}
					/>
					
					<button className="add-button" onClick={this.handleNoteAdd}>Add</button>
					<NotesColorPicker onNoteColorChoosed={this.handleColorChoosed}/>
										
			</div> 
		);
	}
});

var NotesColorPicker = React.createClass({
	getInitialState() {
		return {
			colors: 
			[
				{
	                id: 1,
	                color: '#FFD700'
	            }, {
	                id: 2,
	                color: '#FFFFFF'
	            }, {
	                id: 3,
	                color: '#90EE90'
	            }, {
	                id: 4,
	                color: '#87CEFA'
	            }, {
	                id: 5,
	                color: '#FFB6C1'
	            }, {
	                id: 6,
	                color: '#5F9EA0'
	            }, {
	                id: 7,
	                color: '#FFA07A'
	            }, {
	                id: 8,
	                color: '#00FA9A'
	            }
	        ]
		};
	},
	
	render: function(){
		var onColorChoosed = this.props.onNoteColorChoosed;
		return(
			<div className="colorGrid">
			{
				this.state.colors.map(function(color){
                        return (
                            <ColorItem
                                key={color.id}
                                color={color.color}
                                onColorChoosed={onColorChoosed.bind(null, color)}
                                >
                            </ColorItem>
                        );
                    })
			}
			</div>
			
		);
	}

});

var ColorItem = React.createClass({

	
	render: function(){
		var style = { backgroundColor: this.props.color };
		return(
			<li className="colorItem" style={style} id={this.props.key} onClick={this.props.onColorChoosed}></li>			
		);
	}

});




var NotesGrid = React.createClass({

	componentDidMount() {
		var grid = this.refs.grid;
		this.msnry = new Masonry( grid, {
			itemSelector: '.note',
			columnWidth: 200,
			gutter: 10
		});
	},

	componentDidUpdate(prevProps) {
		if (this.props.notes.length !== prevProps.notes.length){
			this.msnry.reloadItems();
            this.msnry.layout();
		}
	},

	render: function() {
		var onNoteDelete = this.props.onNoteDelete;

		return (
			<div className="notes-grid" ref="grid">
				 {
                    this.props.notes.map(function(note){
                        return (
                            <Note
                                key={note.id}
                                onDelete={onNoteDelete.bind(null, note)}
                                color={note.color}>
                                {note.text}
                            </Note>
                        );
                    })
                }
			</div>
		);
	}

});

var NotesSearch = React.createClass({

	render(){
		return(
				<input type="text" className="search-field" onChange={this.props.onSearch} placeholder="Enter to search..."/>
			);
	}

});

var NotesApp = React.createClass({
	getInitialState() {
		return {	
				notes: [],
				notesBackUp: []
		};
	},

	handleNoteDelete: function(note){
		var noteId = note.id;
		var newNotes = this.state.notes.filter(function(note){
			return note.id !== noteId;
		})
		this.setState({notes: newNotes, notesBackUp: newNotes});
		this._updateLocalStorage();
	},

	componentDidMount() {
		var localNotes = JSON.parse(localStorage.getItem('notes'));
		if (localNotes){
			this.setState({notes: localNotes, notesBackUp: localNotes});
		}
	},

	componentDidUpdate() {
		this._updateLocalStorage();
	},

	handleNoteAdd: function(newNote){
		var newNotes = this.state.notes.slice();
		newNotes.unshift(newNote);
		this.setState({ notes: newNotes, notesBackUp: newNotes });
		this._updateLocalStorage();
	},

	handleSearch(event){
        var searchQuery = event.target.value;
        var dispayedNotes = this.state.notesBackUp.filter(function(note){
        	return note.text.toLowerCase().indexOf(searchQuery) !== -1;
        });	
        this.setState({
            notes: dispayedNotes
        });
	},
	
	render: function() {
		return (
			<div className="notes-app"> 
				<h2 className="app-header">NotesApp</h2>
				<NotesSearch onSearch={this.handleSearch}/>
				<NoteEditor onNoteAdd={this.handleNoteAdd}/>
				<NotesGrid notes={this.state.notes} onNoteDelete={this.handleNoteDelete}/>
			</div>
		);
	},

	_updateLocalStorage: function(){
		var notes = JSON.stringify(this.state.notes);
		localStorage.setItem('notes', notes);
	}

});

ReactDOM.render(
	<NotesApp />,
	document.getElementById('content')
);
