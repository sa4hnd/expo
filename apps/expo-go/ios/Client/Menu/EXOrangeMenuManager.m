// Copyright 2015-present 650 Industries. All rights reserved.

#import "EXOrangeMenuManager.h"
#import "EXHomeModule.h"
#import <UIKit/UIKit.h>

@interface EXOrangeMenuManager ()

@property (nonatomic, strong) UIButton *orangeButton;
@property (nonatomic, assign) BOOL isButtonVisible;

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
  return _isButtonVisible;
}

- (BOOL)showOrangeMenu
{
  if (_isButtonVisible) {
    return NO;
  }
  
  dispatch_async(dispatch_get_main_queue(), ^{
    [self createAndShowButton];
  });
  
  _isButtonVisible = YES;
  return YES;
}

- (BOOL)hideOrangeMenu
{
  if (!_isButtonVisible) {
    return NO;
  }
  
  dispatch_async(dispatch_get_main_queue(), ^{
    [self removeButton];
  });
  
  _isButtonVisible = NO;
  return YES;
}

- (BOOL)toggleOrangeMenu
{
  return self.isVisible ? [self hideOrangeMenu] : [self showOrangeMenu];
}

- (void)createAndShowButton
{
  if (_orangeButton) {
    [_orangeButton removeFromSuperview];
  }
  
  // Get the key window
  UIWindow *keyWindow = nil;
  for (UIWindow *window in [UIApplication sharedApplication].windows) {
    if (window.isKeyWindow) {
      keyWindow = window;
      break;
    }
  }
  
  if (!keyWindow) {
    return;
  }
  
  // Create the button
  _orangeButton = [UIButton buttonWithType:UIButtonTypeCustom];
  
  // Position: left edge, vertically centered
  CGFloat screenHeight = [UIScreen mainScreen].bounds.size.height;
  _orangeButton.frame = CGRectMake(0, screenHeight / 2 - 40, 20, 80);
  
  // Appearance
  _orangeButton.backgroundColor = [UIColor colorWithRed:1.0 green:0.42 blue:0.21 alpha:1.0]; // #FF6B35
  _orangeButton.layer.cornerRadius = 10;
  _orangeButton.layer.shadowColor = [UIColor blackColor].CGColor;
  _orangeButton.layer.shadowOffset = CGSizeMake(0, 2);
  _orangeButton.layer.shadowOpacity = 0.25;
  _orangeButton.layer.shadowRadius = 3.84;
  
  // Add white line indicator
  UIView *lineView = [[UIView alloc] initWithFrame:CGRectMake(9, 20, 2, 40)];
  lineView.backgroundColor = [UIColor whiteColor];
  lineView.layer.cornerRadius = 1;
  lineView.userInteractionEnabled = NO;
  [_orangeButton addSubview:lineView];
  
  // Add action
  [_orangeButton addTarget:self action:@selector(buttonPressed) forControlEvents:UIControlEventTouchUpInside];
  
  // Add to the ROOT view controller's view, not the window
  // This ensures it appears above the content but below any modals/overlays
  UIViewController *rootVC = keyWindow.rootViewController;
  if (rootVC) {
    // Find the topmost presented view controller
    while (rootVC.presentedViewController) {
      rootVC = rootVC.presentedViewController;
    }
    
    // Add to the view hierarchy
    [rootVC.view addSubview:_orangeButton];
    
    // Bring to front
    [rootVC.view bringSubviewToFront:_orangeButton];
  }
}

- (void)removeButton
{
  if (_orangeButton) {
    [_orangeButton removeFromSuperview];
    _orangeButton = nil;
  }
}

- (void)buttonPressed
{
  // Open dev menu or perform action
  if (_delegate && [_delegate respondsToSelector:@selector(homeModuleDidRequestToShowExpoDevMenu:)]) {
    [_delegate performSelector:@selector(homeModuleDidRequestToShowExpoDevMenu:) withObject:nil];
  }
}

- (RCTReactNativeFactory *)mainAppFactory
{
  return [_delegate appDelegateForOrangeMenuManager:self];
}

@end