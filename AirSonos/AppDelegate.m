//
//  AppDelegate.m
//  AirSonos
//
//  Created by RichS on 04/08/2016.
//  Copyright © 2016 RichS. All rights reserved.
//

#import "AppDelegate.h"
#import "AirSonos.h"

#import "NSImage+Extended.h"

@implementation AppDelegate {
    AirSonos* _airSonos;
    NSStatusItem* _statusItem;
    IBOutlet NSMenu *_statusMenu;
}

- (void)applicationDidFinishLaunching:(NSNotification *)aNotification {
    _airSonos = [AirSonos create];
    [_airSonos start];
    
    NSStatusBar *statusBar = [NSStatusBar systemStatusBar];
    _statusItem = [statusBar statusItemWithLength:NSSquareStatusItemLength];
    
    _statusMenu = [[NSMenu alloc] init];
    [_statusMenu addItem:[[NSMenuItem alloc] initWithTitle:@"Start AirSonos" action:@selector(startAirSonos) keyEquivalent:@""]];
    [_statusMenu addItem:[[NSMenuItem alloc] initWithTitle:@"Stop AirSonos" action:@selector(stopAirSonos) keyEquivalent:@""]];
    [_statusMenu addItem:[NSMenuItem separatorItem]];
    //[_statusMenu addItem:[[NSMenuItem alloc] initWithTitle:@"Preferences" action:@selector(actionPreferences) keyEquivalent:@""]];
    [_statusMenu addItem:[[NSMenuItem alloc] initWithTitle:@"Exit" action:@selector(actionExit) keyEquivalent:@""]];
    
    CGFloat menuSize = [[NSStatusBar systemStatusBar] thickness] * 0.7;
    NSImage *menuImage = [[NSImage imageNamed:@"AirSonosMenu"] resizeTo:CGSizeMake(menuSize, menuSize)];
    
    _statusItem.menu = _statusMenu;
    _statusItem.image = menuImage;
    _statusItem.highlightMode = YES;
}

- (void)applicationWillTerminate:(NSNotification *)aNotification {
    [self stopAirSonos];
}

-(void)startAirSonos {
    [_airSonos start];
}

-(void)stopAirSonos {
    [_airSonos stop];
}

-(void)actionPreferences {
}

-(void)actionExit {
    [self stopAirSonos];
    [NSApp performSelector:@selector(terminate:) withObject:nil afterDelay:0.0];
}

@end
