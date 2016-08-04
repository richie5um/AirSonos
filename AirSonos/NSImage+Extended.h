//
//  NSImage+Extended.h
//  TextBar
//
//  Created by RichS on 13/04/2015.
//  Copyright (c) 2015 RichS. All rights reserved.
//

#import <Cocoa/Cocoa.h>

@interface NSImage (EtchedImageDrawing)
- (void)drawEtchedInRect:(NSRect)rect;
-(NSImage*)resizeTo:(NSSize)newSize;
@end