##
 #  @filename   :   main.cpp
 #  @brief      :   1.54inch e-paper display demo
 #  @author     :   Yehui from Waveshare
 #
 #  Copyright (C) Waveshare     September 9 2017
 #
 # Permission is hereby granted, free of charge, to any person obtaining a copy
 # of this software and associated documnetation files (the "Software"), to deal
 # in the Software without restriction, including without limitation the rights
 # to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 # copies of the Software, and to permit persons to  whom the Software is
 # furished to do so, subject to the following conditions:
 #
 # The above copyright notice and this permission notice shall be included in
 # all copies or substantial portions of the Software.
 #
 # THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 # IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 # FITNESS OR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 # AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 # LIABILITY WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 # OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 # THE SOFTWARE.
 ##

import epd1in54
import time
import Image
import ImageDraw
import ImageFont
import sys

def main():
    epd = epd1in54.EPD()
    """
    epd.init(epd.lut_full_update)

    # For simplicity, the arguments are explicit numerical coordinates
    image = Image.new('1', (epd1in54.EPD_WIDTH, epd1in54.EPD_HEIGHT), 255)  # 255: clear the frame
    draw = ImageDraw.Draw(image)
    font = ImageFont.truetype('/usr/share/fonts/truetype/freefont/FreeMonoBold.ttf', 24)
    draw.rectangle((0, 10, 200, 34), fill = 0)
    draw.text((8, 12), 'Hello world!', font = font, fill = 255)
    draw.text((8, 36), 'e-Paper Demo', font = font, fill = 0)
    draw.line((16, 60, 56, 60), fill = 0)
    draw.line((56, 60, 56, 110), fill = 0)
    draw.line((16, 110, 56, 110), fill = 0)
    draw.line((16, 110, 16, 60), fill = 0)
    draw.line((16, 60, 56, 110), fill = 0)
    draw.line((56, 60, 16, 110), fill = 0)
    draw.arc((90, 60, 150, 120), 0, 360, fill = 0)
    draw.rectangle((16, 130, 56, 180), fill = 0)
    draw.chord((90, 130, 150, 190), 0, 360, fill = 0)

    epd.clear_frame_memory(0xFF)
    epd.set_frame_memory(image, 0, 0)
    epd.display_frame()

    epd.delay_ms(2000)
    """
    # for partial update
    #

    #image = Image.open('monocolor.bmp')
##
 # there are 2 memory areas embedded in the e-paper display
 # and once the display is refreshed, the memory area will be auto-toggled,
 # i.e. the next action of SetFrameMemory will set the other memory area
 # therefore you have to set the frame memory twice.
 ##
    #epd.set_frame_memory(image, 0, 0)
    #epd.display_frame()
    #epd.set_frame_memory(image, 0, 0)
    #epd.display_frame()
    arguments = sys.argv
    fontTypes = [ImageFont.truetype('/usr/share/fonts/truetype/freefont/FreeMonoBold.ttf', 30), ImageFont.truetype('/usr/share/fonts/truetype/freefont/FreeMonoBold.ttf', 20)]
    updateType = arguments[1]
    if updateType == "full":
        epd.init(epd.lut_full_update)
    else:
        epd.init(epd.lut_partial_update)
    texts = arguments[2:8]
    #texts = ["  Status  ","-192.168.110.15-","Port:  3000","Akku: 10.5V","Clients:  1","Menu      -"]
    backgrounds = [255,0,0,0,0,255]
    fonts = arguments[8:14]

    epd.clear_frame_memory(0xFF)
    epd.clear_frame_memory(0xFF)

    for i in range(0,6):
        time_image = Image.new('1', (200, 30), 255)  # 255: clear the frame
        draw = ImageDraw.Draw(time_image)
        image_width, image_height  = time_image.size
        draw.rectangle((0, 0, image_width, image_height), fill = 255 - backgrounds[i])
        myFont = fontTypes[int(fonts[i])]
        draw.text((1, 0), texts[i], font = myFont, fill = backgrounds[i])
        epd.set_frame_memory(time_image, 0, i*30 + i*4)

        # display changes
    epd.display_frame()

if __name__ == '__main__':
    main()
