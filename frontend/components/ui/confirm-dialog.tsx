import * as React from 'react';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const ConfirmDialog = AlertDialogPrimitive.Root;

const ConfirmDialogTrigger = AlertDialogPrimitive.Trigger;

const ConfirmDialogPortal = AlertDialogPrimitive.Portal;

const ConfirmDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, children, ...props }, ref) => (
  <AlertDialogPrimitive.Portal>
    <AlertDialogPrimitive.Overlay className={cn('fixed inset-0 z-50 bg-black/50 backdrop-blur-sm', className)} {...props} ref={ref}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    </AlertDialogPrimitive.Overlay>
  </AlertDialogPrimitive.Portal>
));
ConfirmDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;

const ConfirmDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <ConfirmDialogPortal>
    <ConfirmDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-2xl',
        className
      )}
      {...props}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: 'spring', duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AlertDialogPrimitive.Content>
  </ConfirmDialogPortal>
));
ConfirmDialogContent.displayName = AlertDialogPrimitive.Content.displayName;

const ConfirmDialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-2 text-center sm:text-left', className)} {...props} />
);
ConfirmDialogHeader.displayName = 'ConfirmDialogHeader';

const ConfirmDialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)} {...props} />
);
ConfirmDialogFooter.displayName = 'ConfirmDialogFooter';

const ConfirmDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title ref={ref} className={cn('text-lg font-semibold text-foreground', className)} {...props} />
));
ConfirmDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;

const ConfirmDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
));
ConfirmDialogDescription.displayName = AlertDialogPrimitive.Description.displayName;

const ConfirmDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action ref={ref} className={cn(className)} {...props} />
));
ConfirmDialogAction.displayName = AlertDialogPrimitive.Action.displayName;

const ConfirmDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn('mt-2 sm:mt-0', className)}
    {...props}
  />
));
ConfirmDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;

export {
  ConfirmDialog,
  ConfirmDialogTrigger,
  ConfirmDialogContent,
  ConfirmDialogHeader,
  ConfirmDialogFooter,
  ConfirmDialogTitle,
  ConfirmDialogDescription,
  ConfirmDialogAction,
  ConfirmDialogCancel,
};
