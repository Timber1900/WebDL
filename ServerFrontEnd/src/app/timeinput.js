const getTimeInputSpan = (plahh, plamm, plassm, hh, mm, ss, lentotal) => {
  const outerSpan = document.createElement('span')
  outerSpan.classList.add('test3')

  const input1 = document.createElement('input');
  const input2 = document.createElement('input');
  const input3 = document.createElement('input');
  
  input1.setAttribute('type', 'number')
  input2.setAttribute('type', 'number')
  input3.setAttribute('type', 'number')

  input1.setAttribute('placeholder', plahh)
  input2.setAttribute('placeholder', plamm)
  input3.setAttribute('placeholder', plassm)

  input1.classList.add('test1')
  input2.classList.add('test1')
  input3.classList.add('test1')

  const separatorLabel1 = document.createElement('label')
  separatorLabel1.innerHTML = ":"
  separatorLabel1.classList.add('test2')

  const separatorLabel2 = document.createElement('label')
  separatorLabel2.innerHTML = ":"
  separatorLabel2.classList.add('test2')


  const testFuncTwo = function() {
    const value = input1.value.toString() + input2.value.toString() + input3.value.toString()
    const vals = []
    for(let i = value.length - 1; i >= 0; i -= 2){
      vals.push((value[i - 1] ? value[i - 1] : '') + value[i])
    }
    const inputs = [input1, input2, input3]
    let i = 2
    for(const input of inputs){
      input.value = ''
    }
    for(const value of vals){
      if(i >= 0){
        inputs[i].value = value;
      }
      i--
    }
  }

  const enterCheck = function(event) {
    if(event.key === 'Enter') {
      const length = parseInt(input1.value * 3600) + parseInt(input2.value * 60) + parseInt(input3.value)
      if(length > lentotal){
        input1.value = hh; 
        input2.value = mm;
        input3.value = ss;
      }
    }
  }

  const focusOut = function() {
    const length = parseInt(input1.value * 3600) + parseInt(input2.value * 60) + parseInt(input3.value)
    if(length > lentotal){
      input1.value = hh; 
      input2.value = mm;
      input3.value = ss;
    }
  }

  input3.addEventListener('keydown', enterCheck)
  input2.addEventListener('keydown', enterCheck)
  input1.addEventListener('keydown', enterCheck)
  
  input3.addEventListener('focusout', focusOut)
  input2.addEventListener('focusout', focusOut)
  input1.addEventListener('focusout', focusOut)
  
  input3.oninput = testFuncTwo
  input2.oninput = testFuncTwo
  input1.oninput = testFuncTwo

  outerSpan.appendChild(input1)
  outerSpan.appendChild(separatorLabel1)
  outerSpan.appendChild(input2)
  outerSpan.appendChild(separatorLabel2)
  outerSpan.appendChild(input3)
   
  return outerSpan
}

const getTimeInputDiv = (hh, mm, ss, lentotal) => {
  const h = hh.toString().length > 1 ? hh.toString() : (hh.toString().length > 0 ? '0' + hh.toString() : '00')
  const m = mm.toString().length > 1 ? mm.toString() : (mm.toString().length > 0 ? '0' + mm.toString() : '00')
  const s = ss.toString().length > 1 ? ss.toString() : (ss.toString().length > 0 ? '0' + ss.toString() : '00')

  const div = document.createElement('div')
  div.classList.add('inner')
  const leftInput = getTimeInputSpan('00', '00', '00', h, m, s, lentotal)
  const rightInput = getTimeInputSpan(h, m, s, h, m, s, lentotal)
  const to = document.createElement('label')
  to.innerHTML = "To"
  
  const removeButton = document.createElement('button')
  removeButton.classList.add('trim-btn')
  removeButton.innerHTML = "Remove"
  removeButton.setAttribute('onclick', 'this.parentNode.remove()')

  div.appendChild(leftInput)
  div.appendChild(to)
  div.appendChild(rightInput)
  div.appendChild(removeButton)


  return div
}