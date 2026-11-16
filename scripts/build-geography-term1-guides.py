from pathlib import Path
import json, math, re
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph, Table, TableStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.units import cm

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'output/pdf'; OUT.mkdir(parents=True,exist_ok=True)
for name,file in [('Arial','arial.ttf'),('ArialBold','arialbd.ttf'),('ArialItalic','ariali.ttf')]:
    pdfmetrics.registerFont(TTFont(name,'C:/Windows/Fonts/'+file))
pdfmetrics.registerFontFamily('Arial',normal='Arial',bold='ArialBold',italic='ArialItalic',boldItalic='ArialBold')
W,H=A4; M=42; CW=W-2*M
NAVY=colors.HexColor('#14334d'); TEAL=colors.HexColor('#177b80'); GREY=colors.HexColor('#56636b'); LIGHT=colors.HexColor('#e5e9e9'); BLUE=colors.HexColor('#247da4')
PATHS=json.loads(re.search(r'export const ukMapPaths\s*=\s*(\{.*\});', (ROOT/'src/uk-map-paths.js').read_text(encoding='utf8'),re.S).group(1))
SOURCES={
 'maps':('Ordnance Survey map reading','https://www.ordnancesurvey.co.uk/documents/resources/map-reading.pdf'),
 'compass':('Ordnance Survey compass directions','https://www.ordnancesurvey.co.uk/mapzone/map-skills/compasses-and-directions/page-five'),
 'symbols':('Ordnance Survey map symbols','https://www.ordnancesurvey.co.uk/mapzone/map-skills/map-symbols/page-two'),
 'uk':('ONS countries and regions','https://service-manual.ons.gov.uk/content/language/countries-and-regions'),
 'belfast':('Northern Ireland government','https://www.nidirect.gov.uk/articles/about-northern-ireland'),
 'snow':('Met Office snow','https://weather.metoffice.gov.uk/learn-about/weather/types-of-weather/snow'),
 'blizzard':('Met Office blizzards','https://weather.metoffice.gov.uk/learn-about/weather/types-of-weather/snow/blizzard'),
 'polar':('NWS polar vortex','https://www.weather.gov/safety/cold-polar-vortex'),
 'polaruk':('Met Office polar vortex','https://www.metoffice.gov.uk/services/government/contingency-planners/seasonal-forecasts-and-climate-drivers-resources'),
 'tornado':('NWS tornado explanation','https://www.weather.gov/lmk/tornadoesfaq')}

class Guide:
 def __init__(self,group):
    self.group=group; self.file=OUT/f'geography-term-1-study-guide-{group.lower()}.pdf'
    self.c=canvas.Canvas(str(self.file),pagesize=A4);self.c.setTitle(f'Geography Term 1 Study Guide {group}');self.c.setAuthor('Mr Friend');self.page=0
 def start(self,title,subtitle):
    if self.page:self.c.showPage()
    self.page+=1;c=self.c;c.setFillColor(TEAL);c.setFont('ArialBold',10);c.drawString(M,H-36,f'OXFORD INTERNATIONAL SCHOOL   |   {self.group} GEOGRAPHY   |   TERM 1')
    c.setFillColor(colors.black);c.setFont('ArialBold',23);c.drawString(M,H-72,title)
    self.p(subtitle,H-95,10.5,14,color=GREY)
    c.setStrokeColor(LIGHT);c.line(M,40,W-M,40);c.setFillColor(GREY);c.setFont('Arial',9);c.drawString(M,26,'Mr Friend   ·   Read, cover, explain, check');c.drawRightString(W-M,26,f'{self.group}  |  {self.page} of 5')
    return H-127
 def p(self,s,y,size=11.3,leading=15.7,x=M,width=CW,color=colors.black,gap=8):
    style=ParagraphStyle('body',fontName='Arial',fontSize=size,leading=leading,textColor=color,spaceAfter=0)
    para=Paragraph(s,style);aw,ah=para.wrap(width,1000)
    if y-ah<67:raise ValueError(f'{self.group} page {self.page} text exceeds content area: {s[:70]}, bottom {y-ah}')
    para.drawOn(self.c,x,y-ah);return y-ah-gap
 def h(self,s,y,x=M,width=CW):return self.p('<b>'+s+'</b>',y,15,19,x,width,NAVY,9)
 def table(self,heads,rows,y,widths=None,size=10.7):
    widths=widths or [CW/len(heads)]*len(heads)
    st=ParagraphStyle('cell',fontName='Arial',fontSize=size,leading=size+3.5)
    data=[[Paragraph('<b>'+h+'</b>',st) for h in heads]]+[[Paragraph(str(v),st) for v in r] for r in rows]
    t=Table(data,colWidths=widths,hAlign='LEFT');t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),colors.HexColor('#e8f0ef')),('VALIGN',(0,0),(-1,-1),'TOP'),('LINEBELOW',(0,0),(-1,0),.7,TEAL),('LINEBELOW',(0,1),(-1,-1),.4,LIGHT),('LEFTPADDING',(0,0),(-1,-1),8),('RIGHTPADDING',(0,0),(-1,-1),8),('TOPPADDING',(0,0),(-1,-1),7),('BOTTOMPADDING',(0,0),(-1,-1),7)]))
    tw,th=t.wrap(CW,1000)
    if y-th<67:raise ValueError(f'table overflow {self.group} {self.page}')
    t.drawOn(self.c,M,y-th);return y-th-13
 def sources(self,*keys):
    c=self.c;x=M
    for key in keys:
       title,url=SOURCES[key];c.setFillColor(GREY);c.setFont('Arial',8);c.drawString(x,53,title);wid=pdfmetrics.stringWidth(title,'Arial',8);c.linkURL(url,(x,50,x+wid,62),relative=0);x+=wid+16
 def end(self):self.c.save();return self.file

def txt(c,x,y,s,size=11,font='Arial',color=NAVY,anchor='left'):
 c.setFillColor(color);c.setFont(font,size)
 (c.drawCentredString if anchor=='center' else c.drawRightString if anchor=='right' else c.drawString)(x,y,s)
def arrow(c,x1,y1,x2,y2,color=TEAL,width=1.6,head=6):
 c.setStrokeColor(color);c.setFillColor(color);c.setLineWidth(width);c.line(x1,y1,x2,y2);a=math.atan2(y2-y1,x2-x1);p=c.beginPath();p.moveTo(x2,y2);p.lineTo(x2-head*math.cos(a-.45),y2-head*math.sin(a-.45));p.lineTo(x2-head*math.cos(a+.45),y2-head*math.sin(a+.45));p.close();c.drawPath(p,fill=1,stroke=0)
def uk_map(g,x,y,w):
 c=g.c;sc=w/720;h=520*sc;c.setFillColor(colors.HexColor('#edf5f7'));c.rect(x,y,w,h,fill=1,stroke=0)
 fills={'England':'#e6b35a','Scotland':'#69ad94','Wales':'#a6c660','Northern Ireland':'#b49bd6','Ireland':'#ddddda','Isle of Man':'#ddddda'}
 c.saveState();c.translate(x,y+h);c.scale(sc,-sc)
 for country,d in PATHS.items():
    toks=re.findall(r'[MLZ]|-?\d+(?:\.\d+)?',d);i=0;cmd=None;p=c.beginPath()
    while i<len(toks):
      if toks[i] in 'MLZ':
        cmd=toks[i];i+=1
        if cmd=='Z':p.close();continue
      a=float(toks[i]);b=float(toks[i+1]);i+=2
      if cmd=='M':p.moveTo(a,b);cmd='L'
      else:p.lineTo(a,b)
    c.setFillColor(colors.HexColor(fills[country]));c.setStrokeColor(colors.HexColor('#577578'));c.setLineWidth(1);c.drawPath(p,fill=1,stroke=1)
 c.restoreState()
 def pos(a,b):return x+a*sc,y+h-b*sc
 for points in [[(370,160),(438,130),(520,130)],[(420,340),(480,350),(525,350)],[(358,365),(290,386),(205,386)],[(300,265),(253,215),(190,215)]]:
    c.setStrokeColor(GREY);c.setLineWidth(.65);p=c.beginPath();p.moveTo(*pos(*points[0]))
    for point in points[1:]:p.lineTo(*pos(*point))
    c.drawPath(p)
 for a,b,s in [(526,130,'Scotland'),(530,350,'England'),(118,386,'Wales'),(26,212,'Northern Ireland')]:
    xx,yy=pos(a,b);txt(c,xx,yy,s,10.6,'ArialBold')
 for px,py,lx,ly,name in [(447,391,520,426,'London'),(376,392,195,452,'Cardiff'),(376,211,500,204,'Edinburgh'),(314,272,40,288,'Belfast')]:
    xx,yy=pos(px,py);xx2,yy2=pos(lx,ly);c.setStrokeColor(NAVY);c.setLineWidth(.7);c.line(xx,yy,xx2-3 if lx>px else xx2+55,yy2+3);c.setFillColor(colors.HexColor('#a33028'));c.circle(xx,yy,2.7,fill=1,stroke=0);txt(c,xx2,yy2,name,10.4,'ArialBold')
 for a,b,s in [(540,270,'North Sea'),(28,128,'Atlantic Ocean'),(452,490,'English Channel'),(206,343,'Ireland')]:
    xx,yy=pos(a,b);txt(c,xx,yy,s,9.3,'ArialItalic',GREY)
 for a,b,s in [(340,306,'Irish'),(340,322,'Sea')]:
    xx,yy=pos(a,b);txt(c,xx,yy,s,8.8,'ArialItalic',GREY,anchor='center')
 xx,yy=pos(55,410);arrow(c,xx,yy-17,xx,yy+14,NAVY);txt(c,xx,yy+21,'N',10,'ArialBold',anchor='center')
 txt(c,x,y-13,'Country outlines: Natural Earth. Red dots mark capitals approximately.',8.5,'Arial',GREY)
 return y-28

def practice_map(g,x,y,w,h):
 c=g.c;c.setFillColor(colors.HexColor('#f4f7f1'));c.rect(x,y,w,h,fill=1,stroke=0)
 def pt(a,b):return x+a*w/5,y+b*h/4.2
 # Blue river and two distinct route symbols.
 c.setStrokeColor(BLUE);c.setLineWidth(7);p=c.beginPath();xx,yy=pt(3,.3);p.moveTo(xx,yy)
 for a,b in [(2.9,1.1),(3.1,2),(3,3),(3.1,3.9)]:p.lineTo(*pt(a,b))
 c.drawPath(p);c.setStrokeColor(colors.HexColor('#73777c'));c.setLineWidth(8);c.line(*pt(.55,1),*pt(4.5,1))
 c.setStrokeColor(colors.HexColor('#a47025'));c.setLineWidth(2);c.setDash(5,4);c.line(*pt(1,1),*pt(1,3));c.setDash()
 for a,b,label,col in [(1,1,'School','#d7856d'),(4,1,'Shop','#ddc88a')]:
    xx,yy=pt(a,b);c.setFillColor(colors.HexColor(col));c.rect(xx-13,yy-9,26,18,fill=1,stroke=0);txt(c,xx,yy-25,label,10,'ArialBold',anchor='center')
 xx,yy=pt(3,1);c.setFillColor(colors.HexColor('#9b734d'));c.rect(xx-14,yy-8,28,16,fill=1,stroke=0);txt(c,xx+18,yy-25,'Bridge',10,'ArialBold')
 xx,yy=pt(4,3);c.setFillColor(colors.HexColor('#8ac0d8'));c.ellipse(xx-27,yy-17,xx+27,yy+17,fill=1,stroke=0);txt(c,xx,yy-32,'Pond',10,'ArialBold',anchor='center')
 xx,yy=pt(1,3);c.setFillColor(colors.HexColor('#5e9869'))
 for dx,dy in [(-12,0),(0,10),(12,0)]:c.circle(xx+dx,yy+dy,10,fill=1,stroke=0)
 txt(c,xx+31,yy+1,'Woodland',10,'ArialBold');txt(c,*pt(3.35,2.3),'River',10,'ArialItalic',BLUE)
 xx,yy=pt(.38,3.3);arrow(c,xx,yy-8,xx,yy+18,NAVY);txt(c,xx,yy+26,'N',10,'ArialBold',anchor='center')
 txt(c,x,y-13,'Invented practice map. North is up. This sketch is not drawn to scale.',9,'Arial',GREY)

def rose(g,cx,cy,r=70):
 c=g.c
 for angle,label in [(90,'N'),(45,'NE'),(0,'E'),(-45,'SE'),(-90,'S'),(-135,'SW'),(180,'W'),(135,'NW')]:
    a=math.radians(angle);arrow(c,cx,cy,cx+r*.77*math.cos(a),cy+r*.77*math.sin(a),NAVY if len(label)==1 else TEAL,1.5,5)
    txt(c,cx+(r+13)*math.cos(a),cy+(r+13)*math.sin(a)-4,label,12,'ArialBold',anchor='center')
 c.setFillColor(NAVY);c.circle(cx,cy,3,fill=1,stroke=0)

def ruler(g,x,y,length=6):
 c=g.c;c.setStrokeColor(NAVY);c.setLineWidth(.8);c.line(x,y,x+length*cm,y)
 for n in range(length*10+1):
    hh=13 if n%10==0 else 8 if n%5==0 else 4;c.line(x+n*cm/10,y,x+n*cm/10,y+hh)
    if n%10==0:txt(c,x+n*cm/10,y-15,str(n//10),10,anchor='center')
 txt(c,x+length*cm+14,y-15,'cm',10)

def a_guide():
 g=Guide('7A');y=g.start('Geography Term 1 Study Guide','7A   Maps, keys, direction, rulers, scale, and natural and human-made features')
 y=g.p('Use this guide to understand a map and explain what a place is like. Read a section, cover it, say the idea in your own words, then check. You do not have to copy the notes.',y)
 y=g.h('1 Reading a map',y)
 y=g.p('A <b>map</b> represents a place from above. It selects useful information and uses symbols instead of showing every detail. Start with the <b>title</b>, <b>key</b>, <b>north arrow</b> and <b>scale</b>.',y)
 map_y=y-199;practice_map(g,M,map_y,CW,180);y=map_y-36
 y=g.h('A key explains the symbols',y)
 y=g.table(['Symbol in this practice map','Meaning'],[['Solid grey line','Road'],['Dashed brown line','Footpath'],['Blue line','River'],['Blue oval','Pond'],['Green cluster','Woodland'],['Rectangle labelled School or Shop','School or shop building'],['Brown rectangle across the river','Bridge']],y,[CW*.55,CW*.45],10.5)
 y=g.p('<b>Do not guess from colour alone.</b> Blue often shows water, but you must read the key for the map you are using. A symbol represents a feature; it is not a photograph of it.',y)
 g.sources('maps','symbols')

 y=g.start('Compass directions','7A   Use the printed north arrow before describing where a place is')
 y=g.p('A <b>compass rose</b> shows directions on a map. The four main directions are <b>north, east, south and west</b>. The four directions between them are <b>north-east, south-east, south-west and north-west</b>.',y)
 rose(g,M+120,y-110,74)
 xx=M+255;y2=g.h('Read clockwise',y-26,xx,CW-255)
 y2=g.p('N → NE → E → SE → S → SW → W → NW',y2,12,18,xx,CW-255)
 y2=g.p('North-east is halfway between north and east. South-west is the opposite direction.',y2,11.3,16,xx,CW-255)
 y=y-225;y=g.h('2 Use the map to explain a direction',y)
 practice_map(g,M,y-200,CW,185);y=y-234
 y=g.p('<b>From the school:</b> the woodland is north, the bridge is east, and the pond is north-east. <b>From the pond:</b> the school is south-west. Reversing the journey reverses the direction.',y)
 y=g.p('<b>A useful answer:</b> “The pond is north-east of the school.” Name both places so the reader knows your starting point.',y)
 y=g.p('A compass rose is a drawing. A magnetic compass is an instrument whose needle points towards magnetic north. On these practice maps, follow the printed north arrow.',y,10.8,15)
 g.sources('compass','maps')

 y=g.start('Rulers and map scale','7A   Measure the map first, then convert to a real distance')
 y=g.p('A <b>ruler</b> measures a length. Put the zero mark at the start of the line, keep the ruler straight and read the end point. Record the unit, such as centimetres (cm). The edge of a ruler is not always its zero mark.',y)
 y=g.h('3 Link a map length to the ground',y)
 y=g.p('A <b>scale</b> tells us how a distance on the map represents a distance in the real world. In the examples on this page, <b>1 cm on the map represents 50 m on the ground</b>.',y)
 ry=y-79;ruler(g,M+24,ry);c=g.c;c.setStrokeColor(TEAL);c.setLineWidth(3);c.line(M+24,ry+40,M+24+4*cm,ry+40);c.setLineWidth(1);c.line(M+24,ry+24,M+24,ry+48);c.line(M+24+4*cm,ry+24,M+24+4*cm,ry+48);txt(c,M+24+2*cm,ry+53,'4 cm on this printed line',10.5,'ArialBold',anchor='center');y=ry-47
 y=g.table(['Question','Calculation and answer'],[['A map line is 4 cm long. How far is that?','4 × 50 = <b>200 m</b>'],['A path measures 6 cm on the map.','6 × 50 = <b>300 m</b>'],['Draw a line for a real distance of 100 m.','100 ÷ 50 = <b>2 cm</b>']],y,[CW*.54,CW*.46],11)
 y=g.h('If the ruler does not start at zero',y)
 y=g.p('A line begins at the 2 cm mark and ends at the 5.5 cm mark. Its length is <b>5.5 − 2 = 3.5 cm</b>, not 5.5 cm. At our scale, it represents <b>3.5 × 50 = 175 m</b>.',y)
 y=g.h('Measure the route you actually follow',y)
 y=g.p('A straight line measures direct distance. A path may bend around a pond or a building. For a route with sections of 2 cm and 3 cm, add them first: <b>2 + 3 = 5 cm</b>. At our scale the route is <b>250 m</b>.',y)
 y=g.p('<b>Check the scale every time.</b> A different map can use a different scale. Print this PDF at <b>Actual size or 100%</b> if you want to measure the ruler illustration. A screen or resized print may change its physical size.',y,10.8,15)
 g.sources('maps')

 y=g.start('Natural and human-made features','7A   Describe what is there, then explain how people and nature interact')
 y=g.p('A <b>feature</b> is something that can be identified in a place. <b>Natural features</b> form through natural processes. <b>Human-made features</b>, also called man-made or built features, are made or constructed by people.',y)
 y=g.table(['Natural features','Human-made features'],[['River, mountain and valley','Road, railway and bridge'],['Sea, beach and cliff','House, school and shop'],['Naturally formed lake and naturally grown woodland','Dam, canal and reservoir built to store water']],y,[CW/2,CW/2],11)
 y=g.h('4 Some places contain both',y)
 y=g.p('A river is natural. A bridge across it is human-made. Together they create an <b>interaction</b>: the river can be a barrier to travel, while the bridge lets people cross. Building the bridge can also change the riverbank.',y)
 practice_map(g,M,y-155,CW,140);y=y-188
 y=g.p('<b>On the practice map:</b> the school, shop, road and bridge are human-made. The river is natural. A pond or woodland needs more evidence: ponds may be dug by people, and trees may be planted or managed.',y)
 y=g.h('Do not use “green” to mean “natural”',y)
 y=g.p('A planted park has trees and grass, but people may design it, plant it and cut the grass. A reservoir contains water but is created or enlarged by people, often using a dam. Explain <b>how the feature formed</b> rather than deciding from its colour.',y)
 y=g.p('<b>Build an explanation:</b> “The bridge is human-made because people built it. It crosses a natural river, so people can reach the opposite bank.”',y)
 g.sources('maps')

 y=g.start('Check your understanding','7A   Answer aloud or on spare paper, then cover the questions and check below')
 questions=['What does a map key tell you?','Name the four main compass directions.','What direction is halfway between north and east?','On our practice map, in which direction is the pond from the school?','In which direction is the school from the pond?','How should you position a ruler before measuring a line?','A line begins at 2 cm and ends at 5.5 cm. How long is it?','At 1 cm = 50 m, what real distance does a 4 cm map line represent?','At the same scale, how long should a line representing 100 m be?','Name two natural features and two human-made features.','Explain how a bridge and river connect human and physical geography.','Why might a planted park or reservoir need a more careful description?']
 for i,q in enumerate(questions,1):y=g.p(f'<b>{i}.</b> {q}',y,10.7,14.5,gap=3)
 y=g.h('Answers and explanations',y-5)
 answers=['It explains the meaning of the map’s symbols.','North, east, south and west.','North-east (NE).','North-east.','South-west.','Start at zero, align it with the line and read the end mark.','3.5 cm: subtract 2 from 5.5.','200 m: 4 × 50.','2 cm: 100 ÷ 50.','For example, river and mountain; road and school.','People build the bridge over the natural river, allowing a crossing.','They contain natural materials, but people may create, plant or manage them. Explain their origin.']
 for i,a in enumerate(answers,1):y=g.p(f'<b>{i}.</b> {a}',y,10.5,14.1,gap=2.3)
 g.sources('maps','compass');return g.end()

def b_guide():
 g=Guide('7B');y=g.start('Geography Term 1 Study Guide','7B   UK countries and capitals, Great Britain, weather, snowstorms and vortices')
 y=g.p('Learn the places on the map and explain the weather ideas in your own words. Use the final page to check your memory. No copying is needed to use this guide.',y)
 y=g.h('1 The four countries and their capitals',y)
 map_w=460;map_h=520*map_w/720;bottom=y-map_h-3;uk_map(g,M+(CW-map_w)/2,bottom,map_w);y=bottom-33
 y=g.table(['Country within the UK','Capital city'],[['England','London'],['Scotland','Edinburgh'],['Wales','Cardiff'],['Northern Ireland','Belfast']],y,[CW*.55,CW*.45],11.3)
 y=g.p('<b>London is both the capital of England and the capital of the United Kingdom.</b> Edinburgh is Scotland’s capital; Glasgow is a different Scottish city. Belfast is the capital of Northern Ireland; Dublin is the capital of Ireland, which is outside the UK.',y)
 g.sources('uk','belfast')

 y=g.start('Great Britain and the UK','7B   An island and a political state are different kinds of place')
 y=g.p('<b>Great Britain</b> is the large island containing England, Scotland and Wales. These countries also have smaller offshore islands. <b>The United Kingdom</b>, or <b>UK</b>, is a sovereign state made up of four countries: England, Scotland, Wales and Northern Ireland.',y)
 y=g.h('2 The useful memory rule',y)
 c=g.c;dy=y-130;c.setStrokeColor(TEAL);c.setLineWidth(1.2);c.rect(M,dy,210,116,fill=0,stroke=1)
 txt(c,M+105,dy+93,'GREAT BRITAIN',13,'ArialBold',anchor='center')
 for j,t in enumerate(['England','Scotland','Wales']):txt(c,M+105,dy+69-j*21,t,12,anchor='center')
 txt(c,M+232,dy+52,'+',25,'ArialBold',anchor='center');txt(c,M+321,dy+65,'Northern Ireland',12,'ArialBold',anchor='center');txt(c,M+321,dy+43,'on the island of Ireland',9.5,anchor='center');arrow(c,M+230,dy-15,M+425,dy-15);txt(c,M+450,dy-20,'UK',18,'ArialBold',anchor='center');y=dy-49
 y=g.table(['Name','What it means'],[['Great Britain','An island: England, Scotland and Wales.'],['United Kingdom','A state: the three countries above plus Northern Ireland.'],['Island of Ireland','An island containing Northern Ireland and the country Ireland.'],['Ireland','A separate state. Its capital is Dublin. It is not part of the UK.']],y,[CW*.32,CW*.68],10.8)
 y=g.h('Locate the surrounding water',y)
 y=g.p('The <b>Atlantic Ocean</b> lies to the west. The <b>North Sea</b> lies east of Great Britain. The <b>Irish Sea</b> is between Great Britain and the island of Ireland. The <b>English Channel</b> lies between southern England and northern France.',y)
 y=g.p('<b>Test the distinction:</b> Belfast is in the UK, but not on Great Britain. Cardiff is in Wales, on Great Britain and in the UK. England is one part of the UK, not another name for the whole state.',y)
 g.sources('uk')

 y=g.start('Weather and snowstorms','7B   Explain the conditions, not just the weather symbol')
 y=g.p('<b>Weather</b> describes atmospheric conditions in a place over a short time, such as today. <b>Climate</b> describes long-term patterns, usually studied using many years of observations. One snowy day does not describe the whole climate.',y)
 y=g.table(['What we observe','Tool or record','Typical unit or description'],[['Temperature','Thermometer','Degrees Celsius (°C)'],['Rainfall','Rain gauge','Millimetres (mm)'],['Wind speed','Anemometer','km/h, m/s or mph'],['Wind direction','Wind vane','The direction wind comes FROM']],y,[CW*.25,CW*.30,CW*.45],10.5)
 y=g.h('3 How snow reaches the ground',y)
 y=g.p('Ice crystals grow in cold clouds and can join to form snowflakes. If the air along their fall is cold enough, they reach the ground without completely melting. Snow needs <b>moisture as well as cold conditions</b>. A cold day is not automatically a snowy day.',y)
 c=g.c;cy=y-50
 for dx,word in [(0,'Ice crystals in cloud'),(181,'Snowflakes fall'),(361,'Snow reaches ground')]:
    txt(c,M+dx+72,cy+12,word,10.1,'ArialBold',anchor='center')
    if dx<361:arrow(c,M+dx+150,cy+16,M+dx+175,cy+16)
 txt(c,M+CW/2,cy-16,'Cold enough through the falling path',10,'ArialItalic',GREY,anchor='center');y=cy-43
 y=g.h('Snowstorm and blizzard',y)
 y=g.p('A <b>snowstorm</b> is a period of stormy weather with significant snowfall. A <b>blizzard</b> involves strong winds blowing falling or loose snow, with severely reduced visibility. Blowing snow can continue even after new snow stops falling. Not every snowfall or snowstorm is a blizzard.',y)
 y=g.p('Snow can build into <b>drifts</b> where wind piles it up. Roads may become blocked, surfaces icy and journeys difficult. <b>Visibility</b> means how far you can see clearly. In a blizzard, snow in the air can hide roads, landmarks and the horizon.',y)
 y=g.p('<b>Example:</b> “It is −2°C” gives a temperature. “Strong wind is blowing snow across the road and hiding the view” describes conditions associated with a blizzard. A <b>northerly wind</b> comes from the north, not towards the north.',y,10.9,15.2)
 g.sources('snow','blizzard')

 y=g.start('Polar vortex and tornadoes','7B   Both involve rotating air, but their size, height and effects are very different')
 y=g.p('A <b>vortex</b> is a circulation of fluid around a centre. Air is a fluid, so rotating air can form a vortex. The polar vortex and a tornado are different examples; they are not two names for the same weather event.',y)
 c=g.c;diagram_top=y-4;cy=diagram_top-82;cx=M+118
 c.setStrokeColor(BLUE);c.setLineWidth(3);c.arc(cx-54,cy-54,cx+54,cy+54,0,290)
 a=math.radians(290);ex=cx+54*math.cos(a);ey=cy+54*math.sin(a);arrow(c,ex-8,ey-4,ex,ey,BLUE,2,7)
 txt(c,cx,cy+7,'North Pole',11,'ArialBold',anchor='center');txt(c,cx,cy-11,'Arctic',10,anchor='center');txt(c,cx,cy-75,'Top view high above the Arctic',9,'ArialItalic',GREY,anchor='center')
 tx=M+CW*.75;ground=cy-50;c.setStrokeColor(GREY);c.setLineWidth(1);c.line(tx-78,ground,tx+78,ground)
 c.setFillColor(colors.HexColor('#c2cbd1'))
 for dx,dy,r in [(-38,40,22),(-12,53,26),(15,49,25),(40,39,22)]:c.circle(tx+dx,cy+dy,r,fill=1,stroke=0)
 p=c.beginPath();p.moveTo(tx-31,cy+33);p.lineTo(tx+28,cy+33);p.lineTo(tx+15,cy+2);p.lineTo(tx+7,ground);p.lineTo(tx-3,ground);p.lineTo(tx-10,cy+1);p.close();c.setFillColor(colors.HexColor('#8b969f'));c.drawPath(p,fill=1,stroke=0)
 for yy,rr in [(cy+18,24),(cy+2,16),(cy-14,10)]:c.setStrokeColor(NAVY);c.arc(tx-rr,yy-5,tx+rr,yy+5,10,300)
 txt(c,tx,ground-23,'Side view from cloud to ground',9,'ArialItalic',GREY,anchor='center')
 y=cy-104;col=(CW-24)/2;x2=M+col+24
 ya=g.h('4 Polar vortex',y,width=col);yb=g.h('5 Tornado',y,x=x2,width=col)
 polar='A polar vortex is a vast circulation of winds around a pole. The winter <b>stratospheric polar vortex</b> is high in the atmosphere above the Arctic. Its winds help keep very cold air near the pole.<br/><br/>If this circulation weakens or is disturbed, it can influence weather patterns below and make some cold outbreaks more likely. It <b>does not guarantee snow in the UK</b>: moisture and suitable temperatures are also needed. It is not a funnel touching the ground.'
 tornado='A tornado is a <b>violently rotating column of air</b> connected to a thunderstorm and reaching the ground. Water droplets can make a funnel visible; dust or debris may also reveal the circulation.<br/><br/>Some thunderstorms develop rotation, but only a small proportion produce tornadoes. A thunderstorm does not automatically make one. Tornadoes can cause damaging <b>local winds</b>. They are far smaller and usually shorter-lived than the polar vortex, and are not limited to snowy weather.'
 ya=g.p(polar,ya,10.9,15,x=M,width=col);yb=g.p(tornado,yb,10.9,15,x=x2,width=col);y=min(ya,yb)-8
 y=g.table(['Compare','Polar vortex','Tornado'],[['Where?','High in the atmosphere','Cloud to ground'],['Scale and effect','Vast circulation; influences broader weather patterns','Local rotating air column; can cause direct wind damage']],y,[CW*.18,CW*.41,CW*.41],10.1)
 g.sources('polar','polaruk','tornado')

 y=g.start('Check your understanding','7B   Try these aloud, cover the answers, then check the explanation')
 questions=['Name the four UK countries and match each one to its capital.','Which city is the capital of both England and the UK?','Which three countries are on Great Britain?','Why is Belfast in the UK but not on Great Britain?','Is the country Ireland part of the UK? Name its capital.','Which sea is east of Great Britain? Which is between Great Britain and Ireland?','What is the difference between weather and climate?','What measures temperature, and what is its usual unit in this guide?','What two ingredients does snowfall need besides a suitable cloud?','What makes blizzard conditions different from ordinary falling snow?','Explain one difference between a polar vortex and a tornado.','Does a disrupted polar vortex guarantee UK snow? Does every thunderstorm form a tornado?']
 for i,q in enumerate(questions,1):y=g.p(f'<b>{i}.</b> {q}',y,10.6,14.2,gap=3)
 y=g.h('Answers and explanations',y-4)
 answers=['England—London; Scotland—Edinburgh; Wales—Cardiff; Northern Ireland—Belfast.','London.','England, Scotland and Wales.','Belfast is in Northern Ireland, on the island of Ireland. Northern Ireland is part of the UK.','No. Its capital is Dublin.','North Sea; Irish Sea.','Weather is short-term conditions. Climate is the long-term pattern.','A thermometer; degrees Celsius (°C).','Moisture and air cold enough for flakes to reach the ground without fully melting.','Strong winds blow snow and severely reduce visibility; new snow need not still be falling.','For example: the polar vortex is vast and high in the atmosphere; a tornado is local and reaches the ground.','No to both. Weather needs suitable conditions; neither outcome is automatic.']
 for i,a in enumerate(answers,1):y=g.p(f'<b>{i}.</b> {a}',y,10.3,13.8,gap=2.3)
 g.sources('uk','snow','polar','tornado');return g.end()

if __name__=='__main__':
 for f in [a_guide(),b_guide()]:print(f)
