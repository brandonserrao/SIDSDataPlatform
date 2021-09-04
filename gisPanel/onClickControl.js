class ToggleControl {
    onAdd(map){
      this.map = map;
      this.container = document.createElement('div');
      this.container.className = ' mapboxgl-ctrl my-custom-control';
  
      
      return this.container;
    }
    onRemove(){
      this.container.parentNode.removeChild(this.container);
      this.map = undefined;
    }
    _createButton(className) {
      const el = window.document.createElement('div')
      el.className = className;
      el.setAttribute('id', 'clickInfo');
      //el.textContent = 'toggleControl';
      el.addEventListener('click',(e)=>{
        e.style.display = 'none'
        console.log(e);
        // e.preventDefault()
        e.stopPropagation()
      },false )
      return el;
    }
  }
  