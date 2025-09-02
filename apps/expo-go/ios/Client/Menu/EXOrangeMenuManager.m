// Copyright 2015-present 650 Industries. All rights reserved.

#import "EXOrangeMenuManager.h"
#import "EXOrangeMenuWindow.h"
#import "EXHomeModule.h"

@interface EXOrangeMenuManager ()

@property (nonatomic, strong) EXOrangeMenuWindow *window;

@end

@implementation EXOrangeMenuManager

+ (instancetype)sharedInstance
{
  static EXOrangeMenuManager *manager;
  static dispatch_once_t once;
  dispatch_once(&once, ^{
    manager = [EXOrangeMenuManager new];
  });
  return manager;
}

- (BOOL)isVisible
{
  return _window ? !_window.hidden : NO;
}

- (BOOL)showOrangeMenu
{
  if (![self canChangeVisibility:YES]) {
    return NO;
  }
  [self setVisibility:YES];
  return YES;
}

- (BOOL)hideOrangeMenu
{
  if (![self canChangeVisibility:NO]) {
    return NO;
  }
  [self setVisibility:NO];
  return YES;
}

- (BOOL)toggleOrangeMenu
{
  return self.isVisible ? [self hideOrangeMenu] : [self showOrangeMenu];
}

- (BOOL)canChangeVisibility:(BOOL)visible
{
  if (self.isVisible == visible) {
    return NO;
  }
  return YES;
}

- (void)setVisibility:(BOOL)visible
{
  dispatch_async(dispatch_get_main_queue(), ^{
    if (!self->_window) {
      self->_window = [EXOrangeMenuWindow new];
    }
    if (visible) {
      [self->_window makeKeyAndVisible];
    } else {
      self->_window.hidden = YES;
    }
  });
}

- (RCTReactNativeFactory *)mainAppFactory
{
  return [_delegate appDelegateForOrangeMenuManager:self];
}

@end
