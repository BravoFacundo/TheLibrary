void drawText() {
  
  p1.fill(1);
  p1.textSize(50);
  p1.textFont(font);
  p2.textFont(font);
  p2.fill(1);
  p2.textSize(50);
  p2.imageMode (CENTER);

  for (int i = 0; i < lines; i++)
  {
    if (i < linesSplit) p1.text(lineStrings[i], 60, ((i+1)*60)+100);
    else p2.text(lineStrings[i], 60, ((i+1-linesSplit)*60)+100);
    }
  }
}

void SaveText()
{
  for (int i = 0; i < lines; i++)
  {
    lineStringsToSave[0] = lineStringsToSave[0] + lineStrings[i];
  }
  println(lineStringsToSave[0]);
  saveStrings("Texts/UserText"+(nameID++)+".txt", lineStringsToSave);
  lineStringsToSave[0] = "";
  firstPressedKey = false;
}

void Write()
{
  if (keyCode == BACKSPACE)
  {
    if (lineStrings[currentLine].length() > 0)
    {
      lineStrings[currentLine] = lineStrings[currentLine].substring( 0, lineStrings[currentLine].length()-1 );
      currentCharactersToWin++;
    } else if (lineStrings[currentLine].length() <= 0 && !safety)
    {
      if (currentLine > 0)
      {
        currentLine--;
        lineStrings[currentLine] = lineStrings[currentLine].substring( 0, lineStrings[currentLine].length()-1);
        currentCharactersToWin++;
      }
    }
  } else if (keyCode == ENTER)
  {
    if (!safetyKey)
    {
      currentLine+=1;
      safetyKey = true;
      safety = true;
    }
  } else if (keyCode == SHIFT)
  {
  } 
  else if (currentLine != lines && !(lineStrings[currentLine].length() > charactersPerLine))
  {
    lineStrings[currentLine] = lineStrings[currentLine] + str(key);
    currentCharactersToWin--;
  }
  if (lineStrings[currentLine].length() > charactersPerLine)
  {
    if (currentLine != lines-1) currentLine ++;
    safety = true;
  }
  if (lineStrings[currentLine].length() == 1)
  {
    safety = false;
  }
}

void CalibrateKS() {

  switch(key)
  {
  case '*':
    ks.toggleCalibration();
    break;

  case '-':
    ks.load();
    break;

  case '+':
    ks.save();
    break;
  }
}
