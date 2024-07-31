import React from 'react';

class CustomHeader extends React.PureComponent {
  render() {
    return (
      <div className={'article-header'}>
        <h1 className={'hed'}>
          <span>
            <span className={'purple-text'}>PANDA</span><img className={'animal_icon'} src="static/images/panda.png" alt="Panda" style={{ width: '70px', margin: '0 10px 20px 10px', verticalAlign: 'middle' }} />
             or <span className={'purple-text'}>GIBBON</span><img className={'animal_icon'} src="static/images/gibbon.png" alt="Gibbon" style={{ width: '70px', margin: '0 10px 20px 10px', verticalAlign: 'middle'}} />?
          </span>
        </h1>
        {
          this.props.subtitle && (
            <div className={'sub_title'}>
              {this.props.subtitle}
            </div>
          )
        }
        {
          this.props.author && (
            <div className={'byline'}>
              By: <a href={this.props.authorLink}>{this.props.author}</a>
            </div>
          )
        }
        {
          this.props.authors ? (
            <div className={'byline'}>
              By: {
                this.props.authors.map((author, i) => {
                  if (typeof author === 'string') {
                    return author;
                  }
                  return author.link ? (
                    <span key={author.name}>
                      <a href={author.link}>{author.name}</a>{
                        i < this.props.authors.length - 1 ? (
                          i === this.props.authors.length - 2 ? ' and ' : ', '
                        ) : ''
                      }
                    </span>
                  ) : author.name;
                })
              }
            </div>
          ) : null
        }
        {
          this.props.date && (
            <div className={'idyll-pub-date'}>
              {this.props.date}
            </div>
          )
        }
      </div>
    );
  }
}

CustomHeader._idyll = {
  name: "CustomHeader",
  tagType: "closed",
  props: [{
    name: "title",
    type: "string",
    example: '"Article Title"'
  }, {
    name: 'subtitle',
    type: 'string',
    example: '"Article subtitle."'
  }, {
    name: 'author',
    type: 'string',
    example: '"Author Name"'
  }, {
    name: 'authorLink',
    type: 'string',
    example: '"author.website"'
  }]
}

export default CustomHeader;
